import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import quotesService from '../services/Quotes.service';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  const [quote, setQuote] = useState('');

  async function requestPermissionAndSaveToken() {
    const settings = await messaging().requestPermission();

    if (settings) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      saveTokenToDatabase(token);
    }
  }
  async function saveTokenToDatabase(token) {
    const userId = auth().currentUser.uid;

    await firestore().collection('users').doc(userId).update({
      fcmToken: token,
    });
  }
  useEffect(() => {
    requestPermissionAndSaveToken();
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);
  useEffect(() => {
    getQuote();
  }, []);

  const getQuote = () => {
    const service = new quotesService();
    service.getRandomQuote().then(
      data => {
        setQuote(data);
      },
      error => {
        console.error(error);
      },
    );
  };

  return (
    <LinearGradient colors={['#261B74', '#03152F']} style={styles.container}>
      <View style={styles.scrollContainer}>
        <Image
          source={require('../assets/parchemin.png')}
          style={styles.scroll}
        />
        <View style={styles.textContainer}>
          <Text style={styles.quoteText}>Quote : {quote.content}</Text>
          <Text style={styles.authorText}> {quote.author}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.generateButton, {backgroundColor: '#A27136'}]}
        onPress={getQuote}>
        <Text style={styles.buttonText}>Générer une nouvelle citation</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },

  scroll: {
    width: '120%',
    height: 500,
    resizeMode: 'contain',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '100%',
  },
  quoteText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
  },
  authorText: {
    color: 'black',
    textAlign: 'center',
    padding: 10,
  },
  generateButton: {
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
