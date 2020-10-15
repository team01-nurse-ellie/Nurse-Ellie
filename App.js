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

// Fetch roboto fonts. 
const getFonts = () => Font.loadAsync({
  'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
  'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf')
});

const App = () => {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {

    // QR screen uses a setTimeout() to delay the camera opening. React-Native pops up a warning about long timers so it is supressed now.
    YellowBox.ignoreWarnings(['Setting a timer']);

  }, []);

  if (fontsLoaded) {
    return (
      <FirebaseAuthProvider>
        <AppNavigation />
      </FirebaseAuthProvider>
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