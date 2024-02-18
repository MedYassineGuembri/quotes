import React from 'react';
import {useState, useEffect} from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FriendsScreen from './screens/FriendsScreen';
import ProfileScreen from './screens/ProfileScreen';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Image} from 'react-native';

function ForYou() {
  return <HomeScreen></HomeScreen>;
}

function Friends() {
  return <FriendsScreen></FriendsScreen>;
}

function Profile() {
  return <ProfileScreen></ProfileScreen>;
}

const AuthStack = createBottomTabNavigator();

function AuthenticatedStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Aléatoire"
        component={ForYou}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/random.png')}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
      <AuthStack.Screen
        name="Amis"
        component={Friends}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/friends.png')}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
      <AuthStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/user.png')}
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
    </AuthStack.Navigator>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkAndRequestNotificationPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(newUser => {
      setUser(newUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer>
      {user ? <AuthenticatedStack /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default App;
