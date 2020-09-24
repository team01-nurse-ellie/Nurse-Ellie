import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import Background from '../components/background';

const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Background />
            <Image style={styles.logo} source={require('../assets/android/drawable-mdpi/entry-logo.png')} />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserLinkScreen')}>
                <Image style={{ height: screenHeight * 0.09 }} source={require('../assets/android/drawable-mdpi/g-entry-arrow.png')} />
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
    logo: {
        height: screenHeight * 9 / 16,
        position: 'absolute'
    },
    button: {
        position: 'absolute',
        right: screenWidth / 8,
        bottom: screenHeight / 4.5
    }
});

export default SplashScreen;