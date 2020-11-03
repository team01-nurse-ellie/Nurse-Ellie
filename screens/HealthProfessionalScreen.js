import React, { useState }from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'

import Background from '../components/hpBackground';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import MenuIcon from '../assets/images/hp-menu-icon.svg';
import BlueAddIcon from '../assets/images/blue-add-icon';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const HealthProfessionalScreen = ({navigation}) => {
    const [FieldofPractice, setFieldofPractice] = useState('')
    const [LicenseNumber, setLicenseNumber] = useState('')
    const [RegulatoryBody, setRegulatoryBody] = useState('')
    const usersRef = firebase.firestore().collection('users')

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
        
        usersRef.doc(data).update(obj)

    }

    const HealthProfAlert = () => {
        alert('Your account will need validation in 2-3 business days');
        navigation.navigate('HomeScreen')
      };


    return (
        
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
        <Animatable.View style={styles.drawer} animation="fadeInUpBig">
        <View style={styles.rowContainer}>
        <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Health Professional</Text>
                <Text style={styles.headerFont}> Sign Up</Text>
                <View style={styles.whitePadding}/>
               
                <TextInput style={styles.textInput} placeholder="FieldofPractice" autoCapitalize="none"  onChangeText={(text) => setFieldofPractice(text)}
                    value={FieldofPractice} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput}  placeholder="LicenseNumber" autoCapitalize="none" onChangeText={(text) => setLicenseNumber(text)} 
                 value={LicenseNumber} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput} placeholder="RegulatoryBody" autoCapitalize="none"  onChangeText={(text) => setRegulatoryBody(text)}
                    value={RegulatoryBody} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <View style={styles.whitePadding}/>
                <TouchableOpacity style={styles.BlueAddIcon} onPress={()=>{ onHealthPress(); HealthProfAlert(); }}>
                    <BlueAddIcon />
                </TouchableOpacity>
                <View style={styles.whitePadding}/>
        </View>
                
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    
    background: {
        flex: 10,
        backgroundColor: '#42C86A',
    },
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
    },
    
    heading: {
        flex: 10, 
        justifyContent: 'flex-end', 
        paddingHorizontal: 20, 
        paddingBottom: 5
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 28,
        fontWeight: "100", 
        left: screenWidth/3.25, 
        top: screenHeight * 0.07,
        paddingBottom: 30
    },
    headerImage: {
        position: 'absolute', 
        left: screenWidth/80, 
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
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 30, 
        paddingVertical: 50, 
        paddingHorizontal: 30, 
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.20
    }
});

export default HealthProfessionalScreen;


