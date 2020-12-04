import React, {useState, useEffect, useContext} from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import ProgressCircle from 'react-native-progress-circle';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Background from '../components/BackgroundHP';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/hp-menu-icon.svg';
import TempAvatar from '../assets/images/sm-temp-avatar';

import { firebase } from '../components/Firebase/config'
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { dateFromToday } from '../utils/utils';

const HomeScreenHP = ({ navigation }) => {
    const {currentUser} = useContext(FirebaseAuthContext);
    const [fsPatients, setFsPatients] = useState ([]);
    const [fullName, setfullName] = useState('');
    const [greeting, setGreeting] = useState('');
    // const [patients, setPatients] = useState ([
    //     {patientName: 'Julie Ng', lastSeen: 'Tuesday, October 13th 2020', key: '1'}, 
    //     {patientName: 'Patrick Henderson', lastSeen: 'Wednesday, October 14th 2020', key: '2'}, 
    //     {patientName: 'Lee Follis', lastSeen: 'Monday, October 12th 2020', key: '3'},
    //     {patientName: 'Mary Burns', lastSeen: 'Wednesday, October 14th 2020', key: '4'}
    // ]);
    const [patientsChecked, setPatientsChecked] = useState(20);
    useEffect(()=> {
        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
        loadUsername();
        loadPatients();
        // listener for any changes to user account information
        const userSubscriber = firebase.firestore().collection("users").doc(currentUser.uid
            ).onSnapshot(function(querySnapshot) {
                loadUsername();
            }
        );
        // listener for any changes to userLinks (linked patients)
        const patientSubscriber = firebase.firestore().collection("users").doc(currentUser.uid
            ).collection("userLinks"
            ).onSnapshot(function(querySnapshot) {
                loadPatients();
            }
        );
        // Unsubscribe from listener when no longer in use
        return () => {userSubscriber(); patientSubscriber();}
    }, []);


    async function loadUsername() {
        const user = await firebase.firestore().collection("users").doc(currentUser.uid).get();
        await setfullName(user.data().fullName);
    }
    async function loadPatients() {
        let patients = await fsFn.getallPatients(currentUser.uid);
        await setFsPatients(patients);
    }

    /*Swipeable when User takes medication*/
    const attendedAction = () => {
        return (
            <View style={styles.takenSwipeable}>
                <Text style={styles.swipeableText}> Attended </Text>
            </View>
        )
    }
    /*Swipeable when User does not take medication */
    const truantAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0], 
            outputRange: [0.7, 0]
        })
        return (
            <View style={styles.dismissSwipeable}>
                <Text style={styles.swipeableText}> Truant </Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.button} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={styles.time}> {greeting} </Text>
            <Text style={styles.user}> Dr. Lee Fern </Text>
            <View style={styles.progressCircle}>
                <ProgressCircle
                    percent={patientsChecked}
                    radius={60}
                    borderWidth={10}
                    color="#4A95E1"
                    shadowColor='#3370AC'
                    bgColor='#4285C8'>
                        <Text style={{fontSize: 24, color: '#FFFFFF'}}> {patientsChecked}%</Text>
                </ProgressCircle>
            </View>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <Text style={styles.title}> Patients </Text>
            {fsPatients.length > 0? (
            <FlatList data={fsPatients} renderItem={({item}) => (
                    <Swipeable renderLeftActions={attendedAction} renderRightActions={truantAction}>
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
                    </Swipeable>
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

export default HomeScreenHP;

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#4285C8'
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
        top: screenHeight * 0.45
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
    progressCircle:{
        position: 'absolute', 
        top: screenHeight * 0.2, 
        left: screenWidth/2 -60
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