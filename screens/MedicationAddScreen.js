import React, {useState, useEffect} from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';
import Autocomplete from 'react-native-autocomplete-input';

import Background from '../components/background';
import {getRxnowApproximateNames,getRxnowAllByConcepts,getRxNowDrugsByTtyName,getRxNowTermInfoByRxcui} from '../utils/medication';

const MedicationAddScreen = ({navigation}) => {
    const [searchTerm, setSearchTerm] = useState('') 
    const [rxcui, setRxcui] = useState('')

    useEffect(() => {
        load()
    }, [])

    const onLoginPress = () => {
    }

    async function load() {
        try {
            //const rxStuff = await getRxnowAllByConcepts(['IN','BN','MIN']);
            await getRxNowDrugsByTtyName('molindone');
            await getRxNowTermInfoByRxcui('866516');
        } catch (error) { console.log(error)}
        // get IN, BN, MIN from api

        // assign to hook
        // create list of o
        
    }
    
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.heading}>
                    <Image source={require('../assets/android/drawable-mdpi/return-icon.png')} />
                    <Text style={styles.headerFont}> Add Medication </Text>
                </View> 
                <TextInput style={styles.textInput} placeholder="Ingredient or Brand" autoCapitalize="none" onChangeText={(text) => setSearchTerm(text)}
                    value={searchTerm} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <View style={styles.whitePadding}/>
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
        paddingTop: 10
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100", 
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
    drawer: {
        flex: 4,
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 20, 
        paddingHorizontal: 30, 
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.15
    }
})

export default MedicationAddScreen;