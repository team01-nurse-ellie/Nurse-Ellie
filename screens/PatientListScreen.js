import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

import Background from '../components/BackgroundHP';
import MedicationCard from '../components/MedicationCard';

import MenuIcon from '../assets/images/hp-menu-icon';
import SearchIcon from '../assets/images/search-icon';

import TempAvatar from '../assets/images/sm-temp-avatar';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { dateFromToday } from '../utils/utils';

const PatientListScreen = ({navigation}) => {
    const {currentUser} = useContext(FirebaseAuthContext);
    const [fsPatients, setFsPatients] = useState ([]);

    useEffect(()=>{
        load();
    },[])

    async function load() {
        let patients = await fsFn.getallPatients(currentUser.uid);
        await setFsPatients(patients);
        // Object {
        //     "connectCode": "SBU35",
        //     "email": "patient1@gmail.com",
        //     "fullName": "Brian Fitz",
        //     "id": "73Geey1xYpTgZDPA1c2M8MEUDsU2",
        //     "medications": Array [
        //       Object {
        //         "docId": "POqI3CAlwn5x20JPFP20",
        //         "medication": Object {
        //           "adverseEvents": Array [
        //           ],
        //           "alarm": true,
        //           "alarmRef": "CV382HRGVZ0ZzmRyBkn7",
        //           "daysOfWeek": Array [],
        //           "directions": "Take before meal",
        //           "doseForm": "Tab",
        //           "doseFormRxn": "Oral Tablet",
        //           "endDate": t {
        //             "nanoseconds": 0,
        //             "seconds": 1630382400,
        //           },
        //           "endDateTimestamp": 1630454100000,
        //           "function": "Chest Pain",
        //           "information": "NORVASC is a calcium channel blocker",
        //           "intakeTime": 71700,
        //           "medIcon": "9",
        //           "nameBrand": "Norvasc",
        //           "nameDisplay": "Norvasc",
        //           "nameFullGeneric": "amlodipine 2.5 MG Oral Tablet",
        //           "namePrescribe": "Norvasc 2.5 MG Oral Tablet",
        //           "route": "Oral Pill",
        //           "rxcui": 212542,
        //           "rxcuiGeneric": 308136,
        //           "scheduledTime": Object {
        //             "AM_PM": "PM",
        //             "hour": 7,
        //             "minute": 55,
        //           },
        //           "startDate": t {
        //             "nanoseconds": 0,
        //             "seconds": 1606798800,
        //           },
        //           "startDateTimestamp": 1606870500000,
        //           "strength": "2.5 mg",
        //           "tty": "SBD",
        //         },
        //       },
        //     ],
        //     "userLinks": Array [
        //       "Bm8sgO2qYF3PWWe2qZuy",
        //     ],
        //   }
    }

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Patients
                    </Text>
                </View>
                <View style={styles.searchInput}>
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Patient List..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching for patient...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                {fsPatients.length > 0? (
                <FlatList
                data={fsPatients} 
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Patient', {item: item})}>
                        <MedicationCard>
                            <View>
                                <TempAvatar />
                            </View>
                            <View style={styles.patientInfoView}>
                                <Text style={styles.patientFont}>{item.fullName? item.fullName: ''}</Text>
                                <Text style={styles.lastSeenFont}>
                                    Last Seen:{'\n'} 
                                    {item.fullName ? moment(dateFromToday(item.fullName.charCodeAt(0))).format('dddd MMMM Do YYYY'):''} 
                                </Text>
                            </View>
                        </MedicationCard>
                    </TouchableOpacity>
                )}/>
                ) : (
                    <>
                    <View></View>
                    </>
                )}
            </Animatable.View>
        </KeyboardAvoidingView>
    )
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
    patientFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    lastSeenFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    patientInfoView: {
        width: 260,
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

export default PatientListScreen;