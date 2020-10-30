import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import Background from '../components/background';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import { firebase } from "../components/Firebase/config";
const SplashScreen = ({navigation}) => {
   
    firebase.auth().signOut();
   
   
    return (
        <View style={styles.container}>
            <Background/>
            <View style={styles.logoCircle}>
                <NurseEllieLogo style={styles.logo}/>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('SignInScreen')}>
                <Image style={{ height: screenHeight * 0.09}}source={require('../assets/android/drawable-mdpi/g-entry-arrow.png')} />
            </TouchableOpacity>
        </View>
    )
}


var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        backgroundColor: '#42C86A',
    }, 
    logoCircle: {
        height: 300,
        width: 300,
        borderRadius: 300/2, 
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        position: 'absolute', 
        left: screenWidth/2 - 150, 
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
        right: screenWidth/8, 
        bottom: screenHeight/4.5
    }
});

export default SplashScreen;