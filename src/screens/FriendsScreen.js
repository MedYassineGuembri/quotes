import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  NativeModules,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const {NotificationModule} = NativeModules;

const FriendsScreen = () => {
  const [followingQuotes, setFollowingQuotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [author, setAuthor] = useState('');
  const [quote, setQuote] = useState('');

  useFocusEffect(() => {
    fetchFollowingQuotes();
  });

  const fetchFollowingQuotes = async () => {
    try {
      const currentUserUid = auth().currentUser?.uid;
      if (currentUserUid) {
        const quotes = [];

        const currentUserQuotes = await firestore()
          .collection('quotes')
          .where('userId', '==', currentUserUid)
          .get();
        currentUserQuotes.forEach(doc => {
          quotes.push({id: doc.id, ...doc.data(), posterName: 'Vous'});
        });

        const userDoc = await firestore()
          .collection('users')
          .doc(currentUserUid)
          .get();
        const userData = userDoc.data();
        if (userData && userData.following) {
          const followingUserIds = userData.following;
          for (const userId of followingUserIds) {
            const userDoc = await firestore()
              .collection('users')
              .doc(userId)
              .get();
            const user = userDoc.data();
            if (user) {
              const userQuotes = await firestore()
                .collection('quotes')
                .where('userId', '==', userId)
                .get();
              userQuotes.forEach(doc => {
                quotes.push({id: doc.id, ...doc.data(), posterName: user.name});
              });
            }
          }
        }

        setFollowingQuotes(quotes);
      }
    } catch (error) {
      console.error('Error fetching following quotes: ', error);
    }
  };

  const postQuote = async () => {
    try {
      const currentUserUid = auth().currentUser?.uid;
      if (currentUserUid) {
        await firestore().collection('quotes').add({
          userId: currentUserUid,
          author: author,
          quote: quote,
        });

        setIsModalVisible(false);
        setAuthor('');
        setQuote('');

        fetchFollowingQuotes();
        NotificationModule.postSuccessNotification();
      }
    } catch (error) {
      console.error('Error posting quote: ', error);
    }
  };

  return (
    <LinearGradient colors={['#261B74', '#03152F']} style={styles.container}>
      <View style={{flex: 1, padding: 20}}>
        <Button
          title="Partager votre idée"
          onPress={() => setIsModalVisible(true)}
        />

        <FlatList
          data={followingQuotes}
          style={{marginTop: 20}}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{marginBottom: 20}}>
              <Text style={styles.posterText}>{item.posterName} :</Text>
              <Text style={styles.quoteText}>{item.quote}</Text>
              <Text style={styles.authorText}>- {item.author}</Text>
            </View>
          )}
        />

        <Modal visible={isModalVisible} animationType="slide">
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                marginBottom: 10,
                width: '80%',
              }}
            />
            <TextInput
              placeholder="Quote"
              value={quote}
              onChangeText={setQuote}
              multiline={true}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                marginBottom: 10,
                width: '80%',
                height: 100,
              }}
            />
            <Button
              title="Post Quote"
              style={{
                marginBottom: 10,
              }}
              onPress={postQuote}
            />
            <Button
              title="Cancel"
              style={{
                marginBottom: 10,
              }}
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authorText: {
    fontStyle: 'italic',
    color: 'white',
  },
  posterText: {
    marginBottom: 5,
    color: 'cyan',
    fontWeight: 'bold',
    fontSize: 25,
  },
  quoteText: {
    fontSize: 18,
    color: 'white',
  },
});

export default FriendsScreen;
