import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/BackgroundHP';
import Card from '../components/StandardCard';
import CondensedCard from '../components/CondensedMedCard';
import MedIconIndex from '../components/MedicationImages';

import MenuIcon from '../assets/images/hp-menu-icon';
import EditIcon from '../assets/images/edit-icon';
import PlusIcon from '../assets/images/plus-icon';
import EnterIcon from '../assets/images/entry-triangle-icon.svg';
import DissatisifiedIcon from '../assets/images/scale-dissatisfied-icon';
import TempAvatar from '../assets/images/temp-avatar';

const PatientDetailScreen = ({route, navigation}) => {
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
        {medicationName: 'Caffeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '4'},
    ])
    const { item } = route.params;
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {item.patientName}
                    </Text>
                    <TouchableOpacity>
                        <EditIcon/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'center', paddingBottom: 13}}>
                    <TempAvatar/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8}}>
                    <View>
                        <Text style={styles.apptFont}> Next Appointment </Text>
                    </View>
                    <View>
                        <Text style={styles.dateFont}> Monday, November 23, 2020 </Text>
                    </View>
                </View>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8}}>
                    <View>
                        <Text style={styles.apptFont}> Last Appointment </Text>
                    </View>
                    <View>
                        <Text style={styles.dateFont}> {item.lastSeen} </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 13}}>
                    <Text style={styles.subheadingfont}>
                        Prescribed Medications
                    </Text>
                    <TouchableOpacity onPress={()=>Alert.alert("add medication for patient...")}>
                        <PlusIcon/>
                    </TouchableOpacity>
                </View>
                <FlatList horizontal data={medications} renderItem={({item}) => (
                    <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Medication', {item: item})}>
                        <CondensedCard>
                            <Text style={{paddingBottom: 10}}> {item.medicationName}</Text>
                            {MedIconIndex.index[item.key]}
                            <Text> Intake Time </Text>
                            <Text> {item.alert}</Text>
                        </CondensedCard>
                    </TouchableOpacity>
                )}/>
                <View style={{flexDirection: 'row',  paddingTop: 13}}>
                    <Text style={styles.subheadingfont}>
                        Symptom Checklist
                    </Text>
                </View>
                <Card>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.apptFont}> Completed Date: </Text>
                        <Text style={styles.dateFont}> Monday, October 12, 2020 </Text>
                    </View>
                    <View style={{alignItems: 'center', paddingTop: 3}}>
                        <DissatisifiedIcon/>
                    </View>
                </Card>
                <TouchableOpacity onPress={()=>Alert.alert("requesting symptom checklist...")}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.clickableFont}> 
                            REQUEST SYMPTOM CHECKLIST
                        </Text>
                        <EnterIcon style={{paddingTop: 30}}/>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#4285C8',
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
    apptFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 17, 
        color: 'rgba(0, 0, 0, 0.85)', 
    },
    dateFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)', 
    },
    subheadingfont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    timeFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 16, 
        paddingTop: 5, 
        paddingRight: 5
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

export default PatientDetailScreen;