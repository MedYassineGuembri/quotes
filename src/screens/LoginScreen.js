import React from 'react';
import {firebase} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const LoginScreen = ({navigation, onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');

        onLogin();
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage("L'adresse mail saisie est déja utilisée");
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage("L'adresse mail saisie est invalide!");
        } else {
          setErrorMessage(error.message);
        }
      });
  };
  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        onLogin();
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          setErrorMessage('Aucun utilisateur trouvé pour cet email.');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Mot de passe incorrect pour cet email.');
        } else {
          console.log('Erreur de connexion :', error.message);
        }
      });
  };

  const toggleSignIn = () => {
    setIsSignIn(true);
  };
  const toggleLogIn = () => {
    setIsSignIn(false);
  };

  return (
    <LinearGradient colors={['#261B74', '#03152F']} style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={require('../assets/Q.png')} style={styles.logo}></Image>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <View style={[isSignIn && styles.underline]}>
              <Text
                style={[
                  styles.toggleButton,
                  isSignIn
                    ? styles.inactiveToggleButton
                    : styles.activeToggleButton,
                ]}
                onPress={toggleLogIn}>
                Se connecter
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[
                !isSignIn
                  ? styles.inactiveToggleButton
                  : styles.activeToggleButton,
              ]}>
              <Text style={styles.toggleButton} onPress={toggleSignIn}>
                S'inscrire
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {isSignIn ? (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="white"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="white"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <LinearGradient
              colors={['#FFC937', '#FF3FC0']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.signInButtonColor}>
              <TouchableOpacity
                onPress={handleSignUp}
                style={styles.signInButton}>
                <Text style={styles.buttonText}>S'incrire</Text>
              </TouchableOpacity>
            </LinearGradient>

            {errorMessage ? <Text>{errorMessage}</Text> : null}
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="white"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <TextInput
              value={password}
              placeholder="Mot de passe"
              placeholderTextColor="white"
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <LinearGradient
              colors={['#FFC937', '#FF3FC0']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.signInButtonColor}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => handleLogin(email, password)}>
                <Text style={styles.buttonText}>Se connecter</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
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
  header: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  toggleButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  signInButtonColor: {
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
  },
  activeToggleButton: {
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  inactiveToggleButton: {
    color: 'white',
    fontWeight: 'bold',
    opacity: 0.6,
  },
});
export default LoginScreen;
