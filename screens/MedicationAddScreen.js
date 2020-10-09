import React, {useState, useEffect} from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';
import Autocomplete from 'react-native-autocomplete-input';

import Background from '../components/background';
import {getRxnowApproximateNames,getRxnowAllByConcepts,getRxNowDrugsByTtyName,getRxNowTermInfoByRxcui} from '../utils/medication';


const MedicationAddScreen = ({navigation}) => {
    const [searchTerm, setSearchTerm] = useState('') 
    // master rxcui API query result list
    const [rxcui, setRxcui] = useState([])
    // filtered rxcui API query result list
    const [filterRxcui, setFilterRxcui] = useState([])

    // returns filtered sub-set of master rxnow query
    const findTerm = (term) =>{
        if (term.length < 1) {
            return [];
        }
        const searchTerm = term.trim();
        console.log(searchTerm);
        const regex = new RegExp(searchTerm,'i');
        console.log('before');
        console.log(rxcui[0]);
        const filter = rxcui.filter(ingredientBrand=>ingredientBrand.name.search(regex) >= 0)
        console.log(filter);
        return filter;
    }


    // createa  function that takes a single object as argument
    const renderItem = ({item}) => (
        <TouchableOpacity>
            <Text style={styles.descriptionFont}>{item.name}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        load()
    }, [])

    const onLoginPress = () => {
    }





    async function load() {
        try {
            const rxStuff = await getRxnowAllByConcepts(['IN','BN','MIN']);
            //const temp = await getRxNowDrugsByTtyName('molindone');
            //await getRxNowTermInfoByRxcui('866516');
            //await console.log(temp);
            console.log('hello');
            //const blahbah = await fetch('http://dummy.restapiexample.com/api/v1/employees');
            //const monkey = await blahbah.json();
            await setRxcui(rxStuff);
            await console.log(rxcui);
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
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    inputContainerStyle={styles.searchResults}
                    listContainerStyle={styles.searchResults2}
                    listStyle={styles.searchResults2}
                    data={filterRxcui}
                    defaultValue={searchTerm}
                    onChangeText={(text) => setFilterRxcui(findTerm(text))}
                    placeholder="Enter Ingredient or Brand"
                    renderItem={renderItem}
                />
                <View style={styles.medicationDisplay}></View>
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
        flex:1,
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.38)',
        margin:2.5,
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14, 
    },
    drawer: {
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 20, 
        paddingHorizontal: 30, 
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.15
    },
    searchResults: {
        width:'100%',
        alignContent:'flex-end'
    },
    searchResults2: {
        width:'100%',
        alignContent:'flex-end'
    },
    medicationDisplay: {
    }
})

export default MedicationAddScreen;