import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, FlatList, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';
import ProgressCircle from 'react-native-progress-circle';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';

import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';

const HomeScreen = ({ navigation }) => {
    const [greeting, setGreeting] = useState('');
    const [medicationTaken, setMedicationTaken] = useState(0);
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
    ])

    const takenAction = () => {
        return (
            <View style={styles.takenSwipeable}>
                <Text style={styles.swipeableText}> Taken </Text>
            </View>
        )
    }

    const dismissAction = (progress, dragX) => {
        return (
            <View style={styles.dismissSwipeable}>
                <Text style={styles.swipeableText}> Dismiss </Text>
            </View>
        )
    }

    useEffect(()=> {
        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.button} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={styles.time}> {greeting} </Text>
            <Text style={styles.user}> Helen Smith </Text>
            <View style={styles.progressCircle}>
                <ProgressCircle
                    percent={medicationTaken}
                    radius={70}
                    borderWidth={10}
                    color="#34DB66"
                    shadowColor="#3FB763"
                    bgColor="#42C86A"
                    >
                        <Text style={styles.takenPercentage}> {medicationTaken}%</Text>
                </ProgressCircle>
            </View>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15}}>
                <Text style={styles.title}> Medications </Text>
                <MedicationsIcon/>
            </View>
                <FlatList data={medications} renderItem={({item}) => (
                    <Swipeable renderLeftActions={takenAction} renderRightActions={dismissAction}>
                        <MedicationCard>
                            <View style={styles.medicationInfoView}>
                                <Text style={styles.medicationFont}>{item.medicationName}</Text>
                                {/*  <Text style={styles.functionFont}>no simple function in db yet</Text> */}
                                <Text style={styles.frequencyfont}>{item.frequency}</Text>
                                </View>
                                <View style={styles.timeView}>
                                    <Text style={styles.timeFont}>{item.alert}</Text>
                                </View>
                        </MedicationCard>
                    </Swipeable>
                )}/>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

export default HomeScreen;

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#42C86A'
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
        top: screenHeight * 0.4
    }, 
    button: { 
        position: 'absolute',
        right: 30,
        top: 40 
    }, 
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    }, 
    time: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
        color: 'white',
        position: 'absolute', 
        top: 50, 
        padding: 15
    }, 
    user: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
        color: 'white',
        position: 'absolute', 
        top: 100,
        left: screenWidth/3, 
    }, 
    progressCircle: {
        position: 'absolute', 
        top: screenHeight * 0.20, 
        left: screenWidth/2 - 60
    }, 
    takenPercentage: {
        fontFamily: 'roboto-regular', 
        color: 'white', 
        fontSize: 24, 
        justifyContent: 'center', 
    }, 
    dismissSwipeable: {
        flex: 1, 
        backgroundColor: '#EA3217', 
        borderRadius: 10, 
        justifyContent: 'center',  
        alignItems: 'flex-end', 
        paddingHorizontal: 10
    }, 
    takenSwipeable: {
        flex: 1, 
        backgroundColor: '#42C86A', 
        borderRadius: 10, 
        justifyContent: 'center', 
        paddingHorizontal: 10
    }, 
    swipeableText: {
        color: 'white', 
        fontFamily: 'roboto-regular', 
        fontSize: 14
    }
})