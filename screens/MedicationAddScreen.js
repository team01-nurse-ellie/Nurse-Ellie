import React, {useState} from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';

import Background from '../components/background';

const MedicationAddScreen = ({navigation}) => {
    const [searchTerm, setSearchTerm] = useState('') 
    const [rxcui, setRxcui] = useState('')
    
    const onLoginPress = () => {

    }

    
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Sign-In </Text>
                <View style={styles.whitePadding}/>
                <TextInput style={styles.textInput} placeholder="Email Address" autoCapitalize="none"  onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>  
                <TextInput style={styles.textInput} placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)}
                    value={password} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TouchableOpacity style={styles.button} onPress={()=>onLoginPress()}>
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding}/>
                <Text style={styles.descriptionFont}> Don't have an account yet? </Text>
                <TouchableOpacity onPress={()=>navigation.push('SignUpScreen')}> 
                    <Text style={styles.clickableFont}> SIGN UP </Text>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#42C86A',
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
    heading: {
        flex: 1, 
        justifyContent: 'flex-end',
        position: 'absolute', 
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
})

export default MedicationAddScreen;