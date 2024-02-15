import React from 'react';
import {Text, View, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Profile Screen Content Goes Here</Text>
        <Button title="disconnect" onPress={signOut} />
      </View>
    </View>
  );
};

export default ProfileScreen;
