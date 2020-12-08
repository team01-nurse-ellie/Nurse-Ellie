import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import { generateCode } from '../utils/codeGenerator';

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
                const usersRef = firebase.firestore().collection('users')
                let code = generateCode();
                console.log(code)
                // if (usersRef.where("connectCode", "==", code).get().length == 0) {
                //     console.log("none found")
                // }

                // Ensures the code is not the same as any other user. 
                await usersRef.where("connectCode", "==", code).get().then((querySnapshot) => {
                    querySnapshot.forEach(e => {
                        console.log("querying foreach");
                        if (e.data().length > 0) {
                            console.log("CHANGING");
                            code = generateCode();
                        }
                    });
                })

                console.log(code)

                const data = {
                    id: uid,
                    gender: 'Other',
                    date: new Date(),
                    image: '1',
                    email,
                    fullName,
                    connectCode: code,
                    // Holds the reference ids to userlink table  
                    userLinks: [],
                };

                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate('HomeScreen')
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
            });
    }

    return (
        <View style={styles.container}>
            <Background />
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig">
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={[PatientStyles.headerFont, {left: screenWidth/3.5, top: screenHeight * 0.07, paddingBottom: 30}]}> Sign-Up </Text>
                <View style={styles.whitePadding} />
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Full Name" autoCapitalize="none" onChangeText={(text) => setFullName(text)}
                    value={fullName} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Email Address" autoCapitalize="none" onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} secureTextEntry placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}
                    value={password} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} secureTextEntry placeholder="Confirm Password" autoCapitalize="none" placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} />
                <TouchableOpacity style={styles.button} onPress={() => onRegisterPress()}>
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding} />
                <Text style={PatientStyles.descriptionFont}> Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.push('SignInScreen')}>
                    <Text style={PatientStyles.clickableFont}> SIGN IN </Text>
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
    headerImage: {
        position: 'absolute',
        left: screenWidth / 20,
        top: screenHeight * 0.07
    },
    whitePadding: {
        height: screenHeight / 8
    },
    button: {
        paddingRight: 30,
        marginTop: 30
    },

});

export default SignUpScreen;