import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchUserName();
    fetchFollowers();
    fetchFollowing();
  }, []);

  const openAddFriendsPopup = () => {
    setSearchText('');
    setIsModalVisible(true);
  };

  const fetchUserName = async () => {
    try {
      const currentUserUid = auth().currentUser?.uid;
      if (currentUserUid) {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUserUid)
          .get();
        const userData = userDoc.data();
        if (userData && userData.name) {
          setCurrentUser(userData.name);
        }
      }
    } catch (error) {
      console.error('Error fetching user name: ', error);
    }
  };
  const fetchFollowers = async () => {
    try {
      const currentUserUid = auth().currentUser?.uid;
      if (currentUserUid) {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUserUid)
          .get();
        const userData = userDoc.data();
        if (userData && userData.followers) {
          const followersData = [];
          for (const followerId of userData.followers) {
            const followerDoc = await firestore()
              .collection('users')
              .doc(followerId)
              .get();
            const followerData = followerDoc.data();
            if (followerData && followerData.name) {
              followersData.push({id: followerId, name: followerData.name});
            }
          }
          setFollowers(followersData);
        }
      }
    } catch (error) {
      console.error('Error fetching followers: ', error);
    }
  };
  const fetchFollowing = async () => {
    try {
      const currentUserUid = auth().currentUser?.uid;
      if (currentUserUid) {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUserUid)
          .get();
        const userData = userDoc.data();
        if (userData && userData.following) {
          const followingsData = [];
          for (const followingId of userData.following) {
            const followingDoc = await firestore()
              .collection('users')
              .doc(followingId)
              .get();
            const followingData = followingDoc.data();
            if (followingData && followingData.name) {
              followingsData.push({id: followingId, name: followingData.name});
            }
          }
          setFollowing(followingsData);
        }
      }
    } catch (error) {
      console.error('Error fetching following: ', error);
    }
  };
  const unfollowUser = async userIdToUnfollow => {
    try {
      const db = firestore();
      const currentUserId = auth().currentUser?.uid;

      const currentUserDocRef = db.collection('users').doc(currentUserId);
      const unfollowedUserDocRef = db.collection('users').doc(userIdToUnfollow);

      await currentUserDocRef.update({
        followers: firestore.FieldValue.arrayRemove(userIdToUnfollow),
      });
      await unfollowedUserDocRef.update({
        following: firestore.FieldValue.arrayRemove(currentUserId),
      });
      setFollowers(prevFollowers =>
        prevFollowers.filter(follower => follower.id !== userIdToUnfollow),
      );
    } catch (error) {
      console.error('Error unfollowing user: ', error);
    }
  };
  const deleteUser = async userIdToDelete => {
    try {
      const db = firestore();
      const currentUserId = auth().currentUser?.uid;

      const currentUserDocRef = db.collection('users').doc(currentUserId);
      const unfollowedUserDocRef = db.collection('users').doc(userIdToDelete);

      await currentUserDocRef.update({
        following: firestore.FieldValue.arrayRemove(userIdToDelete),
      });
      await unfollowedUserDocRef.update({
        followers: firestore.FieldValue.arrayRemove(currentUserId),
      });
      setFollowing(prevFollowing =>
        prevFollowing.filter(following => following.id !== userIdToDelete),
      );
    } catch (error) {
      console.error('Error unfollowing user: ', error);
    }
  };

  const searchUsers = async searchTerm => {
    try {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      const currentUserUid = auth().currentUser?.uid;
      if (!currentUserUid) return;

      const usersCollection = firestore().collection('users');

      await fetchFollowing();
      const followingIds = following.map(item => item.id);

      const querySnapshot = await usersCollection
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();

      const users = [];
      querySnapshot.forEach(doc => {
        const userId = doc.id;
        if (userId !== currentUserUid && !followingIds.includes(userId)) {
          users.push({id: userId, ...doc.data()});
        }
      });

      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users: ', error);
    }
  };

  const followUser = async userIdToFollow => {
    try {
      const db = firestore();
      const currentUserId = auth().currentUser?.uid;

      const currentUserDocRef = db.collection('users').doc(currentUserId);
      const userToFollowDocRef = db.collection('users').doc(userIdToFollow);

      const batch = db.batch();

      batch.update(currentUserDocRef, {
        following: firestore.FieldValue.arrayUnion(userIdToFollow),
      });

      batch.update(userToFollowDocRef, {
        followers: firestore.FieldValue.arrayUnion(currentUserId),
      });

      await batch.commit();
      setIsModalVisible(false);
      fetchFollowing();
    } catch (error) {
      console.error('Error following user: ', error);
    }
  };
  useEffect(() => {
    searchUsers(searchText);
  }, [searchText]);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <LinearGradient colors={['#261B74', '#03152F']} style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}>
          <Text style={styles.usernameText}>Welcome, {currentUser}</Text>
        </View>
        <View style={{marginTop: 20, marginBottom: 20}}>
          <Button title="Add Friends" onPress={openAddFriendsPopup} />

          <Modal visible={isModalVisible} animationType="slide">
            <TextInput
              placeholder="Search by name"
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                  }}>
                  <Text>{item.name}</Text>
                  <TouchableOpacity onPress={() => followUser(item.id)}>
                    <Text style={{marginLeft: 10, fontSize: 20}}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </Modal>
        </View>
        <View>
          <Text style={styles.listTitle}>Followers: {followers.length}</Text>
          <FlatList
            data={followers}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text style={styles.listText}>{item.name}</Text>
                <TouchableOpacity onPress={() => unfollowUser(item.id)}>
                  <Text style={{color: 'red', fontSize: 35}}>-</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.listTitle}>Following: {following.length}</Text>
          <FlatList
            data={following}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text style={styles.listText}>{item.name}</Text>
                <TouchableOpacity onPress={() => deleteUser(item.id)}>
                  <Text style={{color: 'red', fontSize: 35}}>-</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      <Button title="Se déconnecter" onPress={signOut} />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  usernameText: {
    color: 'white',
    fontSize: 20,
  },
  listText: {
    color: 'white',
    fontSize: 20,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'cyan',
  },
});

export default ProfileScreen;
