import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';

import MedIconIndex from '../components/MedicationImages';

import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon';
import MedicationsIcon from '../assets/images/medications-icon';
import SearchIcon from '../assets/images/search-icon';

const MedicationsScreen = ({navigation}) => {
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
    ])
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Medications
                    </Text>
                    <MedicationsIcon/>
                </View>
                <View style={styles.searchInput}>
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Medication..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching medication...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                <FlatList data={medications} renderItem={({item}) => (
                    <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Medication', {item: item})}>
                        <MedicationCard>
                            <View style={{justifyContent:'center', paddingHorizontal:6, width: 60}}>
                                {MedIconIndex.index[item.key]}
                            </View>
                            <View style={styles.medicationInfoView}>
                            <Text style={styles.medicationFont}>{item.medicationName}</Text>
                            <Text style={styles.functionFont}>{item.function}</Text>
                            <Text style={styles.frequencyfont}>{item.frequency}</Text>
                            </View>
                            <View style={styles.timeView}>
                                <Text style={styles.timeFont}>{item.alert}</Text>
                            </View>
                        </MedicationCard>
                    </TouchableOpacity>
                )}/>
                <Button title="ADD NEW MEDICATION" color='#42C86A' onPress={()=>Alert.alert('add a new medication...')}/>
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
    header:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 10
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    }, 
    medicationFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    functionFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    frequencyfont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    timeFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)', 
    },
    medicationInfoView: {
        width: 170,
        paddingHorizontal: 10
    },
    timeView:{
        borderLeftColor: 'rgba(0, 0, 0, 0.33)', 
        borderLeftWidth: 1,
        paddingHorizontal: 15, 
        justifyContent: 'center', 
        width: 100
    },
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
    },
    searchInput:{
        flexDirection: 'row',
        borderBottomColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomWidth: 1, 
        minWidth: screenWidth * 0.80, 
        marginVertical:10
    },
    searchButton:{
        right: 5
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

export default MedicationsScreen;