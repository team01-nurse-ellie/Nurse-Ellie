import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Swipeable } from "react-native-gesture-handler";

import Background from '../components/background';

import AlarmIcon from '../assets/images/alarm-icon';
import AcceptIcon from '../assets/images/accept-icon';
import DismissIcon from '../assets/images/dismiss-icon';

import GreenMedication from '../assets/images/green-medication-icon';

const NotificationScreen = ({navigation}) => {
    const [medicationTaken, setMedicationTaken] = useState('false');

    const onTaken = () => {
        setMedicationTaken(true);
        navigation.navigate('Home');
    }

    const onDismiss = () => {
        setMedicationTaken(false);
        navigation.navigate('Home');
    }


    return (
        <View style={styles.container}>
            <Background/>
            <View style={styles.centerCircle}>
                <Text style={styles.alarmText}> 10:00AM </Text>
                <GreenMedication />
                <Text style={styles.medicationText}> Monopril </Text>
                <Text>High Blood Pressure</Text>
            </View>
            <View style={styles.alarmIconCircle}>
                <AlarmIcon/>    
            </View>
            <TouchableOpacity style={styles.snoozeButton}>
                <Text style={styles.snoozeText}> SNOOZE 10 MINUTE </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onTaken} style={styles.acceptCircle}>
                <AcceptIcon/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDismiss} style={styles.dismissCircle}>
                <DismissIcon/>
            </TouchableOpacity>
        </View>
    )
}

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#42C86A',
    },
    centerCircle: {
        height: 300,
        width: 300,
        borderRadius: 300 / 2,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        position: 'absolute',
        left: screenWidth / 2 - 150,
        top: screenHeight / 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alarmIconCircle: {
        height: 80, 
        width: 80, 
        borderRadius: 80/2, 
        backgroundColor: '#42C86A', 
        position: 'absolute', 
        left: screenWidth / 2 -40,
        top: screenHeight / 5, 
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    acceptCircle: {
        height: 80, 
        width: 80, 
        borderRadius: 80/2, 
        backgroundColor: '#2D8748', 
        position: 'absolute', 
        left: screenWidth / 2 - 150,
        top: screenHeight / 1.3, 
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    dismissCircle: {
        height: 80, 
        width: 80, 
        borderRadius: 80/2, 
        backgroundColor: '#2D8748', 
        position: 'absolute', 
        left: screenWidth / 2 + 60,
        top: screenHeight / 1.3, 
        justifyContent: 'center', 
        alignItems: 'center'
    }, 
    alarmText: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100", 
        paddingBottom: 30
    }, 
    medicationText: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100", 
    }, 
    snoozeButton: {
        borderRadius: 30, 
        backgroundColor: '#2D8748',
        color: '#FFFFFF',
        width: 150, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        top: screenHeight /1.5,
        left: screenWidth /2 - 75,
    },
    snoozeText: {
        fontFamily: 'roboto-medium', 
        color: '#FFFFFF'
    },
    acceptAction:{
        backgroundColor: '#FFFFFF',
        color: '#000000'
    }, 
    textAction:{
        fontFamily: 'roboto-regular',
        fontSize: 12,
        fontWeight: "100", 
    }
})


export default NotificationScreen;