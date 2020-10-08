import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';

const MedicationsScreen = ({navigation}) => {
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM'}, 
    ])
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <Text style={styles.title}>
                    Medications
                </Text>
                <FlatList data={medications} renderItem={({item}) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('Medication')}>
                        <MedicationCard>
                            <Text>{item.medicationName}</Text>
                            <Text>{item.function}</Text>
                            <Text>{item.frequency}</Text>
                        </MedicationCard>
                    </TouchableOpacity>
                )}/>
                <Button title="ADD NEW MEDICATION" color='#42C86A' onPress={()=>Alert.alert('searching medication...')}/>
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
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 7
    },
    heading: {
        flex: 1,  
        justifyContent: 'flex-end',
        position: 'absolute', 
        paddingHorizontal: 20, 
        paddingBottom: 5
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    }, 
    subheadingFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 24, 
        color: 'rgba(0, 0, 0, 0.85)'
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
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14, 
    },
    menuButton:{
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

export default MedicationsScreen;