import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Switch, Modal, KeyboardAvoidingView, TouchableOpacity,Dimensions, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';
import {CommonActions}  from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';

import Background from '../components/background';
import DayOfWeekPicker from '../components/DayOfWeekPicker';
import DatePicker from '../components/DatePicker';
import IconPicker from '../components/IconPicker';
import TimePicker from '../components/TimePicker';

import MenuIcon from '../assets/images/menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';

import { firebase } from '../components/Firebase/config';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';

const EditMedicationScreen = ({route, navigation }) => {
  const { item } = route.params;
  const {currentUser} = useContext(FirebaseAuthContext);
  const currentTime = new Date();
  const [loading, setLoading] = useState();
  const [medication, setMedication] = useState();
  const [medIcon, setMedIcon] = useState('1');
  const [selectDoW, setSelectDoW] = useState([]);
  const [intakeTime, setIntakeTime] = useState(43200);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarm, setAlarm] = useState('false');
  const [drugFunction, setDrugFunction] = useState('');
  const [directions, setDirections] = useState('');
  const toggleSwitch = () => setAlarm(previousState => !previousState);

  useEffect(() => {
    // subscribe to document of medication
    const subscriber = firebase.firestore()
        .collection("users")
        .doc(currentUser.uid)
        .collection("medications")
        .doc(item.docId)
        .onSnapshot(querySnapshot => {
            if (querySnapshot.data() !== undefined) {
                setMedication(querySnapshot.data());
                setMedIcon(querySnapshot.data().medIcon);
                setIntakeTime(querySnapshot.data().intakeTime);
                setDrugFunction(querySnapshot.data().function);
                setDirections(querySnapshot.data().directions);
                setStartDate(querySnapshot.data().startDate);
                setSelectDoW(querySnapshot.data().daysOfWeek);
                setEndDate(querySnapshot.data().endDate);
                setAlarm(querySnapshot.data().alarm);
                setLoading(false);
            }
        },         
        error => {
            console.log(error)
        });
        // Unsubscribe from document when no longer in use
        return () => subscriber();
    }, [item]);

  // Add medication with user settings to user collection
  const updateMedication = async () => {
    if (startDate == undefined || endDate == undefined) {
        Alert.alert('', '\nPlease select a start and end date');
        return;
    } else if (selectDoW.length == 0) {
        Alert.alert('', '\nPlease select days of week medication will be taken');
        return;
    } else if(moment(endDate) < moment(startDate) || moment(endDate) < moment(currentTime)){
        Alert.alert('', '\nPlease select a valid end date');
        return;
    } else if(!drugFunction.length > 0) {
        Alert.alert('', '\nPlease fill in function of the medication');
        return;
    } else if(!directions.length > 0) {
        Alert.alert('', '\nPlease fill in directions for intake');
        return;
    }
    var medSettings = {
      'medIcon': medIcon,
      'intakeTime' : intakeTime,
      'startDate' : startDate,
      'endDate' : endDate,
      'daysOfWeek' : selectDoW,
      'alarm': alarm,
      'function': drugFunction,
      'directions': directions,
    }
    // Merge medication information from APIs and user specified medication settings
    Object.assign(item.medication, medSettings);
    await fsFn.updateMedication(currentUser.uid, item.docId,item.medication
      // Clear user input components if addition to DB successful
      ).then(() => {
        // resetUserInput();
        Alert.alert('','\nMedication Updated!');
        navigation.navigate('Medication', {item:item});
      }
      ).catch(e => {
        e.toString() == 'Error: Medication already in user collection'? 
        (Alert.alert('','\nYou have already added this medication'), resetUserInput()) : 
        console.log('could not update medication :' + e);
      });
  }

  const resetUserInput = () => {
    setMedIcon('1');
    setIntakeTime(43200);
    setStartDate();
    setEndDate();
    setSelectDoW([]);
    setAlarm(false);
    setDrugFunction();
    setDirections();
  }
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
                <MenuIcon />
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.rowContainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=> navigation.goBack()}>
                            <ReturnIcon/>
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            { item.medication ? item.medication.nameDisplay : ''} { item.medication ? item.medication.strength : ''}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={updateMedication}>
                        <Text style={styles.saveText}> SAVE </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 18 }} />
                <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                    <IconPicker selected={medIcon} onSelect={setMedIcon} />
                    <View style={{ paddingBottom: 18 }} />
                    <TimePicker value={intakeTime} onSelect={setIntakeTime} />
                </View>
                <TextInput style={styles.textInput} placeholder="Function" autoCapitalize="none"  onChangeText={(text) => setDrugFunction(text)}
                    value={drugFunction} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={styles.textInput} placeholder="Directions for use" autoCapitalize="none"  onChangeText={(text) => setDirections(text)}
                value={directions} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <View style={styles.bottomCard}>
                    <View>
                    <Text style={styles.fieldText}> Start </Text>
                    <Text style={styles.fieldText}> Days </Text>
                    <Text style={styles.fieldText}> End </Text>
                    <Text style={styles.fieldText}> Alarm </Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker selected={startDate} onSelect={setStartDate} placeholder="Start Date" />
                    </View>
                    <DayOfWeekPicker selected={selectDoW} onSelect={setSelectDoW} />
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker selected={endDate} onSelect={setEndDate} placeholder="End Date" />
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#42C86A' }}
                        thumbColor={alarm ? '#F4F3F4' : '#F4F3F4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={alarm}
                    />
                    </View>
                </View>
                <View style={{ paddingBottom: 14 }} />
                <TouchableOpacity onPress={async () => {
                    await fsFn.removeMedication(currentUser.uid,item.docId);
                    navigation.navigate('Medications');
                    }}>
                    <Text style={styles.deleteText}> DELETE MEDICATION </Text>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
};

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: '#42C86A',
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
        top: screenHeight * 0.15,
    },
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
    },
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingVertical: 7
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
        paddingHorizontal: 5
    }, 
    bottomCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFF',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 15,
        paddingBottom: 7,
    },
    fieldText: {
        fontFamily: 'roboto-regular',
        fontSize: 14,
        fontWeight: '100',
        paddingBottom: 8,
    },
    saveText: {
        fontFamily: 'roboto-medium', 
        fontSize: 13
    },
    deleteText:{
        color: '#E61616', 
        fontFamily: 'roboto-medium', 
        fontSize: 14
    },
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)',
        borderBottomWidth: 1.5,
        fontSize: 16,
        marginBottom: 8,
    },
});

export default EditMedicationScreen;