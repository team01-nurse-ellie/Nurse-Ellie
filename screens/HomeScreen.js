import React, {useState, useEffect, useRef, useContext} from 'react';

import { View, Text, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet, Platform, FlatList, ActivityIndicator } from 'react-native';
import { firebase } from '../components/Firebase/config';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import { getValueFormatted } from '../utils/utils';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Animatable from 'react-native-animatable';
import * as fsFn  from '../utils/firestore';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressCircle from 'react-native-progress-circle';

import {alarmsRef, usersRef} from '../utils/databaseRefs.js'

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
    handleSuccess: async (id) => console.log(`notification ${id} HandledSuccess`),
    handleError: async (error) => console.log(`${error} FAILED!`)
});

const HomeScreen = ({ navigation }) => {

    // const notificationListener = useRef();
    const responseListener = useRef();
    

    const { currentUser } = useContext(FirebaseAuthContext);
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState();
    const [medicationTaken, setMedicationTaken] = useState(0);
    const [medications, setMedications] = useState ();
    const [fullName, setfullName] = useState('');
    
    useEffect(()=> {
        (async ()=> {
            // **********************************  DUMMY DATA GENERATOR **************************************************//
            // Generate historical intake dummy data (excluding today!)  for current user (can specify num days in function)
            // Simply uncomment -> save -> run -> re-comment below line
            // fsFn.generateIntakeDummyData(currentUser.uid);
            // ***********************************************************************************************************//
            
            
            // await registerForPushNotificationsAsync()
            // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //     console.log(`====ReceivedListener====`);
            //     console.log(notification);
            //     console.log(`========================`);
            // });
            

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(`====ResponseReceivedListener====`);
                console.log(response);
                // .navigate if on same screen it might not send new params???
                // send 2 params for id of the notification being clicked on, and data needed to populate NotificationScreen
                navigation.push("NotificationScreen", {
                    notifID: response.notification.request.identifier,
                    notifData: response.notification.request.content.data,
                });
                console.log(`========================`);
            });
            
        })();
        
        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
        // Listener for changes in user's alarm notification collection
        const alarmNotifSubscriber = alarmsRef.doc(currentUser.uid
            ).collection("medicationAlarms"
            ).onSnapshot(async function(querySnapshot) {
                loadTodayMedNotifs();
                var percentage = await fsFn.getTodayIntakePercentage(currentUser.uid);
                setMedicationTaken(percentage);
            }
        );
        // Listener for changes in user's user document
        const nameSubscriber = usersRef.doc(currentUser.uid
            ).onSnapshot(async function(querySnapshot) {
                loadUserInfo();
            }
        );
        // Unsubscribe from all listeners when no longer in use
        return () => {
            // medSubscriber(); 
            alarmNotifSubscriber();
            nameSubscriber();
            // Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
            console.log("PATIENT HOME SCREEN UN-MOUNTED")
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
    // intakeMedication (uid, rxcui, timestamp, status, notifID)
    // Swipeable completely to right, medication intake recorded as 'taken' and notification removed
    const medTaken = (rxcui, notifID) => {
        fsFn.intakeMedication(currentUser.uid, rxcui, (new Date()).getTime(), 'taken',notifID);
    }
    // Swipeable  completely to left, medication intake recored as 'missed' and notification removed
    const medDismissed = (rxcui, notifID) => {
        fsFn.intakeMedication(currentUser.uid, rxcui, (new Date()).getTime(), 'missed',notifID);
    }

    // Load user's full name and current medications
    async function loadUserInfo() {
        const user = await usersRef.doc(currentUser.uid).get();
        setfullName(user.data().fullName);
        // let meds = await fsFn.getCurrentMedications(currentUser.uid);
        // setMedications(meds);
    }
    // Load user's full name and current medications
    async function loadTodayMedNotifs() {
        // see getDailyMedications definition for medNotif object properties
        const medNotifs = await fsFn.getDailyMedications(currentUser.uid);
        setMedications(medNotifs);
    }
    
    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            {/* <TouchableOpacity style={styles.button} onPress={async () => await scheduleAlarms()}> */}
             <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}> 
                <MenuIcon/>
            </TouchableOpacity>
            {}
            <Text style={styles.time}> {greeting} </Text>
            <Text style={styles.user}> {fullName} </Text>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                    <Text style={PatientStyles.title}> Medications </Text>
                    <MedicationsIcon />
                </View>
            {medications ? (
                <FlatList 
                data={medications.sort((a,b)=>{
                    return a.medication.namePrescribe.localeCompare(b.medication.namePrescribe);
                })}
                keyExtractor={(item) => item.medication.rxcui.toString()}
                renderItem={({item}) => (
                    <Swipeable 
                    renderLeftActions={takenAction} 
                    renderRightActions={dismissAction}
                    onSwipeableLeftOpen={() => {medTaken(item.medication.rxcui, item.notification.id)}} 
                    onSwipeableRightOpen={() => {medDismissed(item.medication.rxcui, item.notification.id)}}>
                        <MedicationCard>
                            <View style={styles.medicationInfoView}>
                            <Text style={styles.medicationFont}>{item.medication.nameDisplay}</Text>
                            <Text style={styles.frequencyfont}>{item.medication.strength}</Text>
                            </View>
                            <View style={styles.timeView}>
                                <Text style={styles.timeFont}>{getValueFormatted(item.medication.intakeTime)}</Text>
                            </View>
                        </MedicationCard>
                    </Swipeable>
                    )}/>
            ): (
                <View style={{flex: 1, justifyContent:'center'}}>
                    <ActivityIndicator/>
                </View>
            )}
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
        height: screenHeight * 0.65,
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