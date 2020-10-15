import React, { useState }from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'

import Background from '../components/background';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const HealthProfessionalScreen = ({navigation}) => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [FieldofPractice, setFieldofPractice] = useState('')
    const [LicenseNumber, setLicenseNumber] = useState('')
    const [RegulatoryBody, setRegulatoryBody] = useState('')
    const usersRef = firebase.firestore().collection('users')

    /*const onHealthPress = async () => {
        const data = await firebase.auth().currentUser.uid
        console.log(data);

        var userDoc = firebase.firestore().collection("users").doc(data).update({
            'FieldofPractice':'',
            'LicenseNumber': '',
            'RegulatoryBody': ''
        })
     }*/

   const onHealthPress = async (res) => {
   const data = await firebase.auth().currentUser.uid
    var userDoc = firebase.firestore().collection("users").doc(data).update({
        'FieldofPractice':'',
        'LicenseNumber': '',
        'RegulatoryBody': ''
    })

    const obj = {

                    FieldofPractice,
                    LicenseNumber,
                    RegulatoryBody,
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(data)
                    .update(obj)

    }

    return (
        <View style={styles.container}>
            <Background/>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Health Professional Sign Up </Text>
                <View style={styles.whitePadding}/>
               
                <TextInput style={styles.textInput} placeholder="FieldofPractice" autoCapitalize="none"  onChangeText={(text) => setFieldofPractice(text)}
                    value={FieldofPractice} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput}  placeholder="LicenseNumber" autoCapitalize="none" onChangeText={(text) => setLicenseNumber(text)} 
                 value={LicenseNumber} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput} placeholder="RegulatoryBody" autoCapitalize="none"  onChangeText={(text) => setRegulatoryBody(text)}
                    value={RegulatoryBody} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <Text>Your account will be verified in the next  2-3 business days. Thank you</Text>
                <Text>Status: Will be loaded from firebase db</Text>
                <TouchableOpacity style={styles.button} onPress={()=>onHealthPress()}>
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

export default HealthProfessionalScreen;