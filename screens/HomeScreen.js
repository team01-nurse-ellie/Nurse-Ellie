import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressCircle from 'react-native-progress-circle';

import * as Animatable from 'react-native-animatable';

import PatientStyles from '../styles/PatientStyleSheet';
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

    /*Swipeable when User takes medication*/
    const takenAction = () => {
        return (
            <View style={styles.takenSwipeable}>
                <Text style={styles.swipeableText}> Taken </Text>
            </View>
        )
    }
    /*Swipeable when User does not take medication */
    const dismissAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0], 
            outputRange: [0.7, 0]
        })
        return (
            <View style={styles.dismissSwipeable}>
                <Text style={styles.swipeableText}> Dimiss </Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={styles.time}> {greeting} </Text>
            <Text style={styles.user}> Helen Smith </Text>
            <View style={styles.progressCircle}>
                <ProgressCircle
                    percent={medicationTaken}
                    radius={60}
                    borderWidth={10}
                    color="#34DB66"
                    shadowColor='#3FB763'
                    bgColor='#42C86A'>
                        <Text style={{fontSize: 24, color: '#FFFFFF'}}> {medicationTaken}%</Text>
                </ProgressCircle>
            </View>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10}}>
            <Text style={PatientStyles.title}> Medications </Text>
            <MedicationsIcon />
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
        top: screenHeight * 0.38
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
    user:{
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "200",
        color: 'white',
        position: 'absolute', 
        top: 100, 
        left: screenWidth/3
    }, 
    progressCircle:{
        position: 'absolute', 
        top: screenHeight * 0.2, 
        left: screenWidth/2 -60
    }, 
    takenSwipeable: {
        flex: 1, 
        backgroundColor: '#42C86A', 
        justifyContent: 'center', 
        borderRadius: 10,
    }, 
    swipeableText: {
        color: 'white', 
        paddingHorizontal: 10, 
        fontFamily: 'roboto-regular',
        fontSize: 16,
    }, 
    dismissSwipeable: {
        flex: 1, 
        backgroundColor: '#EA3217', 
        justifyContent: 'center', 
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center'
    }
})