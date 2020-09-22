import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const SignUpScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Background/>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Sign-Up </Text>
                <View style={styles.whitePadding}/>
                <TextInput style={styles.textInput} placeholder="Full Name" autoCapitalize="none" />
                <TextInput style={styles.textInput} placeholder="Email Address" autoCapitalize="none"/> 
                <TextInput style={styles.textInput} placeholder="Password" autoCapitalize="none"/>
                <TouchableOpacity style={styles.button} >
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding}/>
                <Text style={styles.descriptionFont}> Already have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.push('SignInScreen')}> 
                    <Text style={styles.clickableFont}> SIGN IN </Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
    }, 
    heading: {
        flex: 1, 
        justifyContent: 'flex-end', 
        paddingHorizontal: 20, 
        paddingBottom: 5
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100", 
        left: screenWidth/3.5, 
        top: screenHeight * 0.07,
        paddingBottom: 30
    },
    headerImage: {
        position: 'absolute', 
        left: screenWidth/20, 
        top: screenHeight * 0.07
    },
    whitePadding: {
        height: screenHeight/8
    },
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)', 
        borderBottomWidth: 1.5,
        fontSize: 16, 
        paddingTop: 8
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)'
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14, 
    },
    button: { 
        paddingRight: 30,
        marginTop: 30
    }, 
    drawer: {
        flex: 4,
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 50, 
        paddingHorizontal: 30, 
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.15
    }
});

export default SignUpScreen;