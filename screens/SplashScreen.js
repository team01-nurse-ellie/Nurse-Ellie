import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';

const SplashScreen = ({ navigation }) => {
    return (
        <View style={[PatientStyles.background, {justifyContent: 'center'}]}>
            <Background />
            <View style={styles.logoCircle}>
                <NurseEllieLogo style={styles.logo} />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignInScreen')}>
                <Image style={{ height: screenHeight * 0.09 }} source={require('../assets/android/drawable-mdpi/g-entry-arrow.png')} />
            </TouchableOpacity>
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