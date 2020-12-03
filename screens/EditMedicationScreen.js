import React, { useState, useContext,useEffect } from 'react';
import { View, Text, Switch, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Keyboard, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {CommonActions}  from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';

import PatientStyles from '../styles/PatientStyleSheet';
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
  const [user, setUser] = useState('');
  const currentTime = new Date();
  const [medication, setMedication] = useState();
  const [loading, setLoading] = useState();
  const [medIcon, setMedIcon] = useState('1');
  const [selectDoW, setSelectDoW] = useState([]);
  const [intakeTime, setIntakeTime] = useState(43200);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarm, setAlarm] = useState('false');
  const [drugFunction, setDrugFunction] = useState('');
  const [directions, setDirections] = useState('');
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [editWarning, setEditWarning] = useState(false);
  const toggleSwitch = () => setAlarm(previousState => !previousState);

  useEffect(() => {
    // subscribe to document of medication
    setLoading(true);
    // Determine if route.params passed patient's medication or the current user's medication
    const user = item.isPatient ? item.patientId : currentUser.uid;
    setUser(user);
    // Subscribe to medication in firestore
    const subscriber = firebase.firestore()
        .collection("users")
        .doc(user)
        .collection("medications")
        .doc(item.docId)
        .onSnapshot(querySnapshot => {
            if (querySnapshot.data() !== undefined) {
                setMedication(querySnapshot.data());
                setMedIcon(querySnapshot.data().medIcon);
                setIntakeTime(querySnapshot.data().intakeTime);
                setDrugFunction(querySnapshot.data().function);
                setDirections(querySnapshot.data().directions);
                setStartDate(querySnapshot.data().startDate.toDate());
                setSelectDoW(querySnapshot.data().daysOfWeek);
                setEndDate(querySnapshot.data().endDate.toDate());
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
      'startDate' : new Date(startDate),
      'endDate' : new Date(endDate),
      'daysOfWeek' : selectDoW,
      'alarm': alarm,
      'function': drugFunction,
      'directions': directions,
    }
    // Merge medication information from APIs and user specified medication settings
    Object.assign(item.medication, medSettings);
    await fsFn.updateMedication(user, item.docId,item.medication
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
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={PatientStyles.menuButton} onPress={() => navigation.openDrawer()}>
                <MenuIcon />
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig">
                <View style={styles.rowContainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=> navigation.goBack()}>
                            <ReturnIcon/>
                        </TouchableOpacity>
                        <Text style={[PatientStyles.title, {paddingHorizontal: 5}]}>
                            { item.medication ? item.medication.nameDisplay : ''}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={()=>setEditWarning(true)}>
                        <Text style={styles.saveText}> SAVE </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 18 }} />
                { loading ? (
                <>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <ActivityIndicator/>
                    </View>
                </>
                ) : (
                <>
                <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                    <IconPicker selected={medIcon} onSelect={setMedIcon} />
                    <View style={{ paddingBottom: 18 }} />
                    <TimePicker value={intakeTime} onSelect={setIntakeTime} />
                </View>
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Function" autoCapitalize="none"  onChangeText={(text) => setDrugFunction(text)}
                    value={drugFunction} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Directions for use" autoCapitalize="none"  onChangeText={(text) => setDirections(text)}
                value={directions} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <View style={PatientStyles.card}>
                    <View>
                    <Text style={PatientStyles.fieldText}> Start </Text>
                    <Text style={PatientStyles.fieldText}> Days </Text>
                    <Text style={PatientStyles.fieldText}> End </Text>
                    <Text style={PatientStyles.fieldText}> Alarm </Text>
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
                <TouchableOpacity onPress={()=> setDeleteWarning(true)}>
                    <Text style={styles.deleteText}> DELETE MEDICATION </Text>
                </TouchableOpacity>
                <Modal
                    isVisible={deleteWarning}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    onBackButtonPress={()=> setDeleteWarning(false)}
                    backdropOpacity={0}>
                    <View style={styles.centeredView}>
                        <View style={styles.confirmationModal}>
                            <Text style={styles.confirmationFont}> Warning </Text>
                            <View style={{paddingVertical: 5}}/>
                            <Text> You are about to remove a medication that was prescribed by your health professional. They will receive notice that you have made these changes. Would you like to continue? </Text>
                            <View style={{paddingVertical: 5}}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={async () => {
                                        await fsFn.removeMedication(user,item.docId);
                                        // navigation.navigate('Medications');
                                        await navigation.navigate(item.isPatient ? 'Patient' : 'Medications')
                                    }}>
                                        <Text style={styles.confirmationTouchable}>CONTINUE</Text>
                                </TouchableOpacity>
                                <View style={{paddingHorizontal:10}}/>
                                <TouchableOpacity onPress={()=> setDeleteWarning(false)}>
                                    <Text style={styles.confirmationTouchable}>RETURN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={editWarning}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    onBackButtonPress={()=> setEditWarning(false)}
                    backdropOpacity={0}>
                    <View style={styles.centeredView}>
                        <View style={styles.confirmationModal}>
                            <Text style={styles.confirmationFont}> Warning </Text>
                            <View style={{paddingVertical: 5}}/>
                            <Text> You are about to make changes to a medication that was prescribed by your health professional. They will receive notice that you have made these changes. Would you like to continue? </Text>
                            <View style={{paddingVertical: 5}}/>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={updateMedication}>
                                    <Text style={styles.confirmationTouchable}>CONTINUE</Text>
                                </TouchableOpacity>
                                <View style={{paddingHorizontal:10}}/>
                                <TouchableOpacity onPress={()=> setEditWarning(false)}>
                                    <Text style={styles.confirmationTouchable}>RETURN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
            )}
            </Animatable.View>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingVertical: 7
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
    centeredView:{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 22
    },
    confirmationModal: {
        backgroundColor: 'white', 
        borderRadius: 25, 
        padding: 35, 
        alignItems: "center", 
        elevation: 5
    }, 
        confirmationFont: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        color: 'rgba(0, 0, 0, 0.95)',
    },
        confirmationTouchable: {
        fontFamily: 'roboto-medium', 
        fontSize: 14, 
        color: '#42C86A'
    }
});

export default EditMedicationScreen;