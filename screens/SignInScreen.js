import React, {useState, useContext} from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import { UserContext } from '../components/UserProvider/UserContext';

const SignInScreen = ({navigation}) => {
    const { accountType } = useContext(UserContext);
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('')
    
    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        if (accountType) {
                            navigation.navigate('HomeScreen');

                        }
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }

    
    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background/>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}> Sign-In </Text>
                <View style={styles.whitePadding}/>
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Email Address" autoCapitalize="none"  onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>  
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)}
                    value={password} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TouchableOpacity style={styles.button} onPress={()=>onLoginPress()}>
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding}/>
                <Text style={PatientStyles.descriptionFont}> Don't have an account yet? </Text>
                <TouchableOpacity onPress={()=>navigation.push('SignUpScreen')}> 
                    <Text style={PatientStyles.clickableFont}> SIGN UP </Text>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    whitePadding: {
        height: screenHeight/8
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
    button: { 
        paddingRight: 30,
        marginTop: 30
    }
})

export default SignInScreen;