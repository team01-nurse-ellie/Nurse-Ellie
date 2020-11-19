import React, { useState, useEffect } from 'react';
import { YellowBox } from 'react-native';
import { StyleSheet, } from 'react-native';
// Firebase Authentication
import { FirebaseAuthProvider } from './components/Firebase/FirebaseAuthProvider';
// Components
import AppNavigation from './components/AppNavigation';
// Expo's splashscreen and font module
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
// Redux to pass store down to all app components
import { Provider as StateProvider } from 'react-redux'
import store from './src/redux/store'

// fix for [Unhandled promise rejection: ReferenceError: Can't find variable: atob]
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }


// Fetch roboto fonts. 
const getFonts = () => Font.loadAsync({
  'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
  'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf')
});

const App = () => {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {

    // QR screen uses a setTimeout() to delay the camera opening. React-Native pops up a warning about long timers so it is supressed now.
    YellowBox.ignoreWarnings(['Non-serializable values were found in the navigation state', 'Setting a timer',]);
    // ScrollPicker in TimePicker warning, and IconPicker warning, respectively.
    YellowBox.ignoreWarnings(['Expected style', 'Failed prop type']);

  }, []);

  if (fontsLoaded) {
    return (
      <StateProvider store={store}>
        <FirebaseAuthProvider>
          <AppNavigation />
        </FirebaseAuthProvider>
      </StateProvider>
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

});

export default App;