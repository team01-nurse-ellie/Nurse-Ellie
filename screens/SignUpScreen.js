import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';

const SignUpScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Background/>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <Text style={styles.headerFont}>
                    <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                    {"  "}Sign-Up 
                </Text>
                <Text> Full Name </Text>
                <TextInput placeholder="Full Name" placeholderTextColor="#666666" autoCapitalize="none" />
                <Text> Username </Text>
                <TextInput placeholder="Username" placeholderTextColor="#666666" autoCapitalize="none"/> 
                <Text> Password </Text>
                <TextInput placeholder="Password" />
                <TouchableOpacity style={styles.button} >
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.descriptionFont}> Already have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.push('SignInScreen')}> 
                    <Text style={styles.clickableFont}> SIGN IN </Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

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
        paddingBottom: 30
    },
    headerImage: {
        flex: 1, 
        height: 80,
        resizeMode: 'contain',
        paddingBottom: 100
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12
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
        bottom: 0
    }
});

export default SignUpScreen;