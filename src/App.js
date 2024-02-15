/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { firebase } from "@react-native-firebase/app"
import auth from "@react-native-firebase/auth"
import { useState, useEffect } from 'react';
import {
  View, TextInput, Button, Text
} from 'react-native';



const App = () => {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        // Naviguer vers un autre écran si nécessaire
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('That email address is invalid!');
        } else {
          setErrorMessage(error.message);
        }
      });
  };


  return (<View>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Button title="Sign Up" onPress={handleSignUp} />
                {errorMessage ? <Text>{errorMessage}</Text> : null}
              </View>)
}


export default App;