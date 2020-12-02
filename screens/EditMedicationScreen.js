import React, { useState, useContext,useEffect } from 'react';
import { View, Text, Switch, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Keyboard, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {CommonActions}  from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
// import {CommonActions}  from '@react-navigation/native';
// import moment from 'moment';

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
import { scheduleNotifications} from '../utils/scheduleNotifications';
import { alarmsRef} from '../utils/databaseRefs';

const EditMedicationScreen = ({route, navigation }) => {
  const { item } = route.params;
  const {currentUser} = useContext(FirebaseAuthContext);
  const currentTime = new Date();
  const [loading, setLoading] = useState();
  const [medication, setMedication] = useState();
  const [medIcon, setMedIcon] = useState('1');
  const [selectDoW, setSelectDoW] = useState([]);
  const [intakeTime, setIntakeTime] = useState(0);
  const [scheduledTime, setScheduledTime] = useState({
    hour: null,
    minute: null, 
    AM_PM: null
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [timestamp, setTimestamp] = useState({
    startDate: item.medication.startDateTimestamp,
    endDate: item.medication.endDateTimestamp
  }); 
  const [alarm, setAlarm] = useState('false');
  const [drugFunction, setDrugFunction] = useState('');
  const [directions, setDirections] = useState('');
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [editWarning, setEditWarning] = useState(false);
  const toggleSwitch = () => setAlarm(previousState => !previousState);

  useEffect(() => {
    // subscribe to document of medication
    // console.log(item, `IN EDIT`)
    // console.log(item.docId)
    const unsubscribe = navigation.addListener('blur', () => {
        // console.log(item.medication)
        resetUserInput();
    })
    // console.log(unsubscribe)
    setLoading(true);
    const subscriber = firebase.firestore()
        .collection("users")
        .doc(currentUser.uid)
        .collection("medications")
        .doc(item.docId)
        .onSnapshot(querySnapshot => {
            // console.log(querySnapshot.data(), "ffffffffffffffffffffffffffff")
            // console.log("yooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
            if (querySnapshot.data() !== undefined) {
                setMedication(querySnapshot.data());
                setMedIcon(querySnapshot.data().medIcon);
                setIntakeTime(querySnapshot.data().intakeTime);
                setDrugFunction(querySnapshot.data().function);
                setDirections(querySnapshot.data().directions);
                setStartDate(querySnapshot.data().startDate.toDate());
                setSelectDoW(querySnapshot.data().daysOfWeek.sort((a,b) => a > b));
                setEndDate(querySnapshot.data().endDate.toDate());
                setAlarm(querySnapshot.data().alarm);
                setLoading(false);
            }
        },         
        error => {
            console.log(error)
        });

        
        // Unsubscribe from document when no longer in use
        return () => {
            subscriber(); 
            unsubscribe();
        }

    }, [item]);

  const deleteMedication = async () => {

      await fsFn.removeMedication(currentUser.uid, item.docId).then(async () => {
        // after medication is deleted, use alarmRef to grab notification IDs
        await alarmsRef.doc(item.medication.alarmRef).get().then(async doc => {
            if (!doc.exists) {
                throw new Error(`ALARM CAN NOT BE FOUND FOR MEDICATION DOC ID: ${item.docId}`);
            }
            // fetch array notification array that holds expo's notification ID and the notification date trigger. 
            let notificationsToDelete = doc.data().notifications;
            
            await (async () => {
                // delete the notification from expo in loop
                for (let i = 0; i < notificationsToDelete.length; i++) {
                    await Notifications.cancelScheduledNotificationAsync(notificationsToDelete[i].id);
                }
            })().then(async () => {
                // remove the alarm document associated with the medication document.
                await alarmsRef.doc(item.medication.alarmRef).delete().then(() => {
                    // navigate to medication list screen after deletion of medication, and its alarm. 
                    navigation.navigate('Medications');
                });
                
            });

        }).catch(error => { throw error; });
        
      });

  };

  // Add medication with user settings to user collection
  const updateMedication = async () => {
    if (startDate == undefined || endDate == undefined) {
        Alert.alert('', '\nPlease select a start and end date');
        return;
    } else if (selectDoW.length == 0) {
        Alert.alert('', '\nPlease select days of week medication will be taken');
        return;
    } else if(timestamp.endDate < timestamp.startDate){
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
      'startDateTimestamp': timestamp.startDate,
      'endDate' : new Date(endDate),
      'endDateTimestamp': timestamp.endDate, 
      'daysOfWeek' : selectDoW,
      'alarm': alarm,
      'function': drugFunction,
      'directions': directions,
      'alarmRef': item.medication.alarmRef
    }

    Object.assign(item.medication, medSettings);

    if (alarm == true) {
        // grabs previous alarm notifications
        await alarmsRef.doc(item.medication.alarmRef).get().then(async doc => {
            if (!doc.exists) {
                throw new Error(`ALARM CAN NOT BE FOUND FOR MEDICATION DOC ID: ${item.docId}`);
            }
            let notificationsToDelete = doc.data().notifications;
            // delete notifs for that 1 med
            await (async () => {
                // delete the notification from expo in loop
                for (let i = 0; i < notificationsToDelete.length; i++) {
                    await Notifications.cancelScheduledNotificationAsync(notificationsToDelete[i].id);
                }
            })().then(async () => {
                // schedule new alarm notifications 
                await scheduleNotifications(item.medication, timestamp, selectDoW).then(async alarm => {
                    
                    if (!alarm) {
                        throw new Error(`NEW SCHEDULED ALARMS DID NOT GET RETURNED`);
                    }
                    
                    const { notifications } = alarm;
                    // update medication 
                    await fsFn.updateMedication(currentUser.uid, item.docId, item.medication
                    ).then(async () => {

                        // overwrites old notifications with new notifications
                        await alarmsRef.doc(item.medication.alarmRef).update({
                            notifications: notifications
                        }).then(() => {
                            Alert.alert('', '\nMedication Updated!');
                            navigation.navigate('Medication', { item: item });
                        });

                    }
                    ).catch(e => {
                        e.toString() == 'Error: Medication already in user collection' ?
                            (Alert.alert('', '\nYou have already added this medication'), resetUserInput()) :
                            console.log('could not update medication :' + e);
                    });

                }).catch(error => { throw error });

            });
        });
    
  
    } else {
        // item.medication.alarmRef = null;
        // Merge medication information from APIs and user specified medication settings
        await fsFn.updateMedication(currentUser.uid, item.docId, item.medication
            // Clear user input components if addition to DB successful
            ).then(async () => {
                // resetUserInput();
                await alarmsRef.doc(item.medication.alarmRef).get().then(async doc => {
                    if (!doc.exists) {
                        throw new Error(`ALARM CAN NOT BE FOUND FOR MEDICATION DOC ID: ${item.docId}`);
                    }
                    let notificationsToDelete = doc.data().notifications;
                    
                // delete notifs for that 1 med
                  await (async () => {
                      // delete the notification from expo in loop
                      for (let i = 0; i < notificationsToDelete.length; i++) {
                          await Notifications.cancelScheduledNotificationAsync(notificationsToDelete[i].id);
                      }
                  })().then(async () => {

                      await alarmsRef.doc(item.medication.alarmRef).update({
                          notifications: []
                      }).then(() => { 
                          Alert.alert('','\nMedication Updated!');
                          navigation.navigate('Medication', {item:item});
                      });
                  })
              })
          }
          ).catch(e => {
            e.toString() == 'Error: Medication already in user collection'? 
            (Alert.alert('','\nYou have already added this medication'), resetUserInput()) : 
            console.log('could not update medication :' + e);
          });
     
    }

  }

  const resetUserInput = () => {
    setMedIcon(item.medication.medIcon);
    // console.log(item.medication.intakeTime)
    setScheduledTime(item.medication.scheduledTime);
    setTimestamp({
        startDate: item.medication.startDateTimestamp,
        endDate: item.medication.startDateTimestamp
    });
    setIntakeTime(item.medication.intakeTime);
    setStartDate(item.medication.startDate);
    setEndDate(item.medication.endDate);
    setSelectDoW(item.medication.daysOfWeek.sort((a,b) => a > b));
    setAlarm(item.medication.alarm);
    setDrugFunction(item.medication.function);
    setDirections(item.medication.directions);
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
                    <TimePicker 
                        value={intakeTime} 
                        onSelect={setIntakeTime} 
                        setScheduledTime={setScheduledTime}
                    />
                </View>
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Function" autoCapitalize="none"  onChangeText={(text) => setDrugFunction(text)}
                    value={drugFunction} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <TextInput style={[PatientStyles.textInput, {marginBottom: 8}]} placeholder="Directions for use" autoCapitalize="none"  onChangeText={(text) => setDirections(text)}
                value={directions} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
                <View style={PatientStyles.card}>
                    <View>
                    <Text onPress={()=> console.log(scheduledTime)} style={PatientStyles.fieldText}> Start </Text>
                    <Text onPress={()=> console.log("start date:", new Date(timestamp.startDate), "\nend date:", new Date(timestamp.endDate))} style={PatientStyles.fieldText}> Days </Text>
                    <Text onPress={()=> console.log(selectDoW)} style={PatientStyles.fieldText}> End </Text>
                    <Text style={PatientStyles.fieldText}> Alarm </Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker 
                            selected={startDate}
                            onSelect={setStartDate}
                            dateTimestamp={(value) => setTimestamp(prev => ({ ...prev, startDate: value }))}
                            time={scheduledTime}
                            timestamp={timestamp}
                            screenType={`Edit Medication`}
                            placeholder="Start Date" 
                        />
                    </View>
                    <DayOfWeekPicker 
                        selected={selectDoW} 
                        onSelect={setSelectDoW}
                        startDate={timestamp.startDate}
                        endDate={timestamp.endDate}
                     />
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker 
                         selected={endDate}
                         onSelect={setEndDate}
                         dateTimestamp={(value) => setTimestamp(prev => ({ ...prev, endDate: value }))}
                         time={scheduledTime}
                         timestamp={timestamp}
                         screenType={`Edit Medication`}
                         placeholder="End Date"
                        />
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
                                        // await fsFn.removeMedication(currentUser.uid,item.docId);
                                        await deleteMedication().then(()=> {
                                            navigation.navigate('Medications');
                                        });
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