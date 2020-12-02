import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';

import Background from '../components/BackgroundHP';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';

import MenuIcon from '../assets/images/hp-menu-icon.svg';
import BlueAddIcon from '../assets/images/blue-add-icon';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const HealthProfessionalScreen = ({ navigation }) => {
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


    // const onHealthPress = async (res) => {
    //     const data = await firebase.auth().currentUser.uid
    //     var userDoc = firebase.firestore().collection("users").doc(data).update({
    //         'FieldofPractice': '',
    //         'LicenseNumber': '',
    //         'RegulatoryBody': ''
    //     })

    //     const obj = {


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
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
                <MenuIcon />
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight / 10 }}>
                <NurseEllieLogo height={75} style={{ flex: 1, marginRight: '5%' }} />
                <Text style={{ fontFamily: 'roboto-regular', fontSize: 25, }}> {`Account Change:\n Health Professional`}</Text>
            </View>

                <TextInput style={styles.textInput} placeholder="Field of Practice" autoCapitalize="none"  onChangeText={(text) => setFieldofPractice(text)}
                    value={FieldofPractice} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput}  placeholder="License Number" autoCapitalize="none" onChangeText={(text) => setLicenseNumber(text)} 
                 value={LicenseNumber} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput} placeholder="Regulatory Body" autoCapitalize="none"  onChangeText={(text) => setRegulatoryBody(text)}
                    value={RegulatoryBody} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>

                <Text style={{marginBottom: 15}}>Status: Will be loaded from firebase db</Text>
           
                <Text style={styles.descriptionFont}>Your account will be verified in the next  2-3 business days. Thank you</Text>

                <TouchableOpacity style={styles.button} onPress={()=>onHealthPress()}>
                    <BlueAddIcon/>
                </TouchableOpacity>

                <View style={styles.whitePadding}/>
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
        fontSize: 28,
        fontWeight: "100", 
    },
    whitePadding: {
        height: screenHeight / 8
    },
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)',
        borderBottomWidth: 1.5,
        fontSize: 16,
        paddingTop: 8
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.7)'
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
    },
    button: {
        marginTop: 30,
        alignSelf: 'flex-start'
    },
    menuButton: {
        position: 'absolute',
        right: 30,
        top: 40
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