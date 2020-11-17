import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import { usersRef, patientsRef, } from '../utils/databaseRefs';

import Background from '../components/background';
import { generateCode } from '../utils/codeGenerator';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        return () => {

        };
    }, []);

    const onRegisterPress = async () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (response) => {

                const uid = response.user.uid
                // const usersRef = firebase.firestore().collection('users')
                // const patientsRef = firebase.firestore().collection('patients')
                
                // if (usersRef.where("connectCode", "==", code).get().length == 0) {
                    //     console.log("none found")
                    // }
                    
                // Ensures the code is not the same as any other user. 
                let code = generateCode();
                await usersRef.where("connectCode", "==", code).get().then((querySnapshot) => {
                    querySnapshot.forEach(e => {
                        console.log("querying foreach");
                        if (e.data().length > 0) {
                            console.log("CHANGING");
                            code = generateCode();
                        }
                    });
                })

                // patient's data
                const patientData = {
                    healthProfessionals: [],
                    medicationRegimes: [],
                    symptomChecklists: [],
                    permissions: {
                        allowMedicationEdit: true,
                        
                    },
                    userRef: uid                      
                };

                // create patient document and then create user document.
                await patientsRef
                    .add(patientData)
                    .then(async (docRef) => { 

                        // user data.
                        const userData = {
                            id: uid,
                            // PATIENT account type by default, can change to HEALTH_PROFESSIONAL if user registers themselves.
                            accountType: "PATIENT",
                            // reference to the patient data in the user document
                            account: docRef.id,
                            // verify status of HP account change             
                            verifiedHP: false,  
                            email,   
                            fullName,
                            connectCode: code,
                            // Holds the reference ids to userlink table  
                            userLinks: [], 
                        };

                        // create user document and navigate to homescreen
                        await usersRef
                            .doc(uid)
                            .set(userData)
                            .then(() => {
                                navigation.navigate('HomeScreen');
                            })
                            .catch((error) => { alert(error) });

                    }).catch(error => { alert(error); });

            }).catch((error) => { alert(error) });
    }

    return (
        <View style={styles.container}>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Sign-Up </Text>
                <View style={styles.whitePadding} />
                <TextInput style={styles.textInput} placeholder="Full Name" autoCapitalize="none" onChangeText={(text) => setFullName(text)}
                    value={fullName} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={styles.textInput} placeholder="Email Address" autoCapitalize="none" onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={styles.textInput} secureTextEntry placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}
                    value={password} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={styles.textInput} secureTextEntry placeholder="Confirm Password" autoCapitalize="none" placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />

                <TouchableOpacity style={styles.button} onPress={() => onRegisterPress()}>
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding} />
                <Text style={styles.descriptionFont}> Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.push('SignInScreen')}>
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
        left: screenWidth / 3.5,
        top: screenHeight * 0.07,
        paddingBottom: 30
    },
    headerImage: {
        position: 'absolute',
        left: screenWidth / 20,
        top: screenHeight * 0.07
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