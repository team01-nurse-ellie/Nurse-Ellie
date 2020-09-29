import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AppLoading } from 'expo';

import { firebase } from "./components/Firebase/config.js";

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import MedicationsScreen from './screens/MedicationsScreen';
import SettingsScreen from './screens/SettingsScreen';

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const getFonts = () => Font.loadAsync({
  'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'), 
  'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf')
});

function DrawerRoutes(){
  return (
    <Drawer.Navigator drawerPosition='right' initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        setIsSignedIn(Boolean(user));
    });
    return () => {
      unsubscribe();
    }
  }, []);
  
  if(fontsLoaded) {
    return (
      <NavigationContainer>
        <RootStack.Navigator headerMode='none'>
          { isSignedIn ? (
            <>
            <RootStack.Screen name="HomeScreen" component={DrawerRoutes} />
            </>
          ) : (
            <>
            <RootStack.Screen name="SplashScreen" component={SplashScreen} />
            <RootStack.Screen name="SignInScreen" component={SignInScreen} />
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
            </>
          ) }
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
    <AppLoading
      startAsync={getFonts}
      onFinish={()=> setFontsLoaded(true)} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
});

export default App;