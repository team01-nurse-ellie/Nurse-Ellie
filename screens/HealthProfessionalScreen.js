import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
// import { firebase } from '../components/Firebase/config';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import { usersRef, accrediationsRef, healthprofsRef } from '../utils/databaseRefs';
import { UserContext } from '../components/UserProvider/UserContext';

import Background from '../components/BackgroundHP';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';

import MenuIcon from '../assets/images/hp-menu-icon.svg';
import BlueAddIcon from '../assets/images/blue-add-icon';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const HealthProfessionalScreen = ({ navigation }) => {

    const { currentUser } = useContext(FirebaseAuthContext);
    const { verifiedHP } = useContext(UserContext);
    const [FieldofPractice, setFieldofPractice] = useState('');
    const [LicenseNumber, setLicenseNumber] = useState('');
    const [RegulatoryBody, setRegulatoryBody] = useState('');
    const [requestedChange, setRequestedChange] = useState(false);
    // const [fieldsFilled, setFilled] = useState(false);
 
    useEffect(()=> {
        
        (async () => {

            await healthprofsRef.where("userRef", "==", currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.exists);
                        setRequestedChange(true);
                        // console.log(doc.id, " => ", (doc.data()));
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });


        })();

        console.log(requestedChange);  

    }, [requestedChange]);
    // const [fullName, setFullName] = useState('')
    // const [email, setEmail] = useState('')
    
    const onHealthPress = async (res) => {

        if (FieldofPractice.length > 0 &&
            LicenseNumber.length > 0 &&
            RegulatoryBody.length > 0) {
            // setFilled(true);
          
            // clear input fields
            setFieldofPractice("");
            setLicenseNumber("");
            setRegulatoryBody("");

            // setFilled(false);
            if (verifiedHP == false && requestedChange == false) {
                console.log("register")
                setRequestedChange(true);
                alert("Your account will be verified in the next 2-3 business days. Thank you");

                // Add new accreditation to DB.
                // await accrediationsRef.add({
                //     fieldOfPractice: FieldofPractice,
                //     licenseNumber: LicenseNumber, 
                //     regulatoryBody: RegulatoryBody,
                //     specialization: "",
                //     userRef: currentUser.uid
                // }).then(async docRef => {
                //     console.log(`added new accreditation for user: ${currentUser.uid}`)
                //     // Once an accreditation is made, create a new HP account and add that new accreditation to that HP account.   
                //     await healthprofsRef.add({
                //         accreditations: [docRef.id],
                //         patients: [],
                //         permissions: {},
                //         userRef: currentUser.uid  
                //     }).then(docRef => {
                //         console.log(`added new HP for user: ${currentUser.uid}`)
                //     }).catch(error => {
                //         console.log(error)
                //     })

                // }).catch(error => {
                //     console.log(error);
                // });
            } else if (verifiedHP == false && requestedChange == true) {
                console.log("pending");
                alert("Your account still needs to be verified.");
            } else if (verifiedHP == true) {
                alert("Account has been verified.")
            }


            // usersRef.doc(currentUser.uid).update({
            //     'FieldofPractice': '',
            //     'LicenseNumber': '', 
            //     'RegulatoryBody': ''
            // })

            // // accreditation 
            // const obj = {
            //     FieldofPractice,
            //     LicenseNumber,
            //     RegulatoryBody,
            // };

            // usersRef.doc(currentUser.uid).update(obj)
        } else {

            if (FieldofPractice.length == 0) {
                alert(`Please fill in Field of Practice`);
            } else if (LicenseNumber.length == 0) {

                alert(`Please fill in License Number`);
            } else if (RegulatoryBody.length == 0) {

                alert(`Please fill in Regulatory Body`);
            }

        }
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

                <TextInput style={styles.textInput} placeholder="Field of Practice" autoCapitalize="none"  onChangeText={(text) => setFieldofPractice(text.trim())}
                    value={FieldofPractice} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput}  placeholder="License Number" autoCapitalize="none" onChangeText={(text) => setLicenseNumber(text.trim())} 
                 value={LicenseNumber} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput} placeholder="Regulatory Body" autoCapitalize="none"  onChangeText={(text) => setRegulatoryBody(text.trim())}
                    value={RegulatoryBody} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>

                <Text style={{ marginVertical: '2%' }}>Status: <Text style={{
                    color: (verifiedHP) ? 'green' : 'orange',
                    fontWeight: 'bold'
                }}>
                    {verifiedHP ?
                        'Verified'
                        : 'Pending'} </Text>
                </Text>
              
           
                {/* <Text style={styles.descriptionFont}></Text> */}

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