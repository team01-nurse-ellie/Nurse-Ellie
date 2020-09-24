import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import * as Font from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AppLoading } from 'expo';

// Screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import UserLinkScreen from './screens/UserLinkScreen';

// Components
import MenuBtn from './components/menu-btn';

const RootStack = createStackNavigator();

const getFonts = () => Font.loadAsync({
  'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
  'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf')
});

function App({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{
            headerShown: false
          }} />
          <RootStack.Screen name="SignInScreen" component={SignInScreen} options={{
            headerShown: false
          }} />
          <RootStack.Screen name="SignUpScreen" component={SignUpScreen} options={{
            headerShown: false
          }} />
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="UserLinkScreen" component={UserLinkScreen}
            options={{
              headerTransparent: true,
              headerLeft: null,
              headerTitle: null,
              headerRight: () => <MenuBtn />
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)} />
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