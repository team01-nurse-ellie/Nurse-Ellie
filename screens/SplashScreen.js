import React, {useEffect, useContext, useState} from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import { firebase } from '../components/Firebase/config.js'
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';

const SplashScreen = ({ navigation }) => {

    const { currentUser } = useContext(FirebaseAuthContext);
    const [signedIn, setSignIn] = useState(true);

    // Get user on mount
    useEffect(() => {

        logout();
    }, []);

  /*   useEffect(() => {

        if (currentUser == null) {
            // displays the icon to sign in page on splashscreen if user is not signed in. 
            // needed to make sure icon is not display when user that is signed in but is on splashscreen b/c of async data.
            setTimeout(() => {
                setSignIn(false);
            }, 1000);

        }

    }, [currentUser]) */
 
    const logout = async () => {

        try {
          await firebase.auth().signOut();
        } catch (error) {
          console.log(error);
        }
    
    };
    
    /*var user = firebase.auth().currentUser;

       if (user) {
          //  firebase.auth().signOut();
            console.log("User session is still within 1 hour, user is still signed in")
        } else {
            firebase.auth().signOut();
           console.log("User is not sign in")
        }*/
    return (
        <View style={[PatientStyles.background, {justifyContent: 'center'}]}>
            <Background />
            <View style={styles.logoCircle}>
                <NurseEllieLogo style={styles.logo} />
            </View>
            {/* (signedIn == false) && */
                
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignInScreen')}>
                    <Image style={{ height: screenHeight * 0.09 }} source={require('../assets/android/drawable-mdpi/g-entry-arrow.png')} />
                </TouchableOpacity>
            }
        </View>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    logoCircle: {
        height: 300,
        width: 300,
        borderRadius: 300 / 2,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        position: 'absolute',
        left: screenWidth / 2 - 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 260,
        width: 260,
        left: 15
    },
    button: {
        position: 'absolute',
        right: screenWidth / 8,
        bottom: screenHeight / 4.5
    }
});

export default SplashScreen;