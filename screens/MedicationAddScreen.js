import React, {useState, useEffect} from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard,FlatList } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config';
import Autocomplete from 'react-native-autocomplete-input';

import Background from '../components/background';
import {getRxnowApproximateNames,getRxnowAllByConcepts,getRxNowDrugsByTtyName,getRxNowTermInfoByRxcui, getAdverseByBnIn,getFdaLabelByRxcui} from '../utils/medication';


const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} >
      <Text >{item.title}</Text>
    </TouchableOpacity>
);


const MedicationAddScreen = ({navigation}) => {
    const [searchTerm, setSearchTerm] = useState('') 
    // master rxcui term list (all possibly ingredients and brand-names)
    const [rxcui, setRxcui] = useState([])
    // filtered rxcui term list (filtered list of ingredients and brand-names)
    const [filterRxcui, setFilterRxcui] = useState([])
    // filtered list of drugs (ingredient, form, strength) based on user-selected ingredient or brand-name
    const [drugList, setDrugList] = useState([])


    // returns filtered sub-set of master rxnow query
    const filterByTerm = (term) =>{
        if (term.length < 1) {
            return [];
        }
        const searchIngBn = term.trim();
        console.log(searchIngBn);
        const regex = new RegExp(searchIngBn,'i');
        console.log(rxcui[0]);
        const filter = rxcui.filter(ingredientBrand=>ingredientBrand.name.search(regex) >= 0)
        console.log(filter);
        return filter;
    }


    // renders ingredients/brand names filtered by user search input
    const renderItem = ({item}) => (
        <TouchableOpacity>
            <Text 
            style={styles.descriptionFont} 
            onPress={ ()=> {
                getDrugsbytty(item.name);
                 
            }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    // when ingredient/brand-name is selected by user from autocomplete list
    async function getDrugsbytty(tty) {
        // get list of drugs for that ingredient
        const drugList = await getRxNowDrugsByTtyName(tty);
        await console.log(drugList);
        await setDrugList(drugList);
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
                    defaultValue={''}
                    onChangeText={(text) => setFilterRxcui(filterByTerm(text))}
                    placeholder="Enter Ingredient or Brand"
                    renderItem={renderItem}
                />
                <FlatList
                    data={drugList}>
                    renderItem={renderDrug}
                    keyExtractor={item =>item.rxcui}
                </FlatList>
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
        paddingHorizontal: 20,
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