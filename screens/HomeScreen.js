import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Button, Dimensions, StyleSheet, Platform, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressCircle from 'react-native-progress-circle';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';

const HomeScreen = ({ navigation }) => {

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      
    const [greeting, setGreeting] = useState('');
    const [pushToken, setToken] = useState('');

    const [medicationTaken, setMedicationTaken] = useState(0);
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
    ])
    useEffect(()=> {
        registerForPushNotificationsAsync();
        sendPushNotif();
        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    const sendPushNotif = async () => {
        console.log("sendPushNotif();");

        const pushNotif = [{
            to: "ExponentPushToken[bWx33iCW7hAkBeWX3u6SkR]",
            title: "MyTitle",
            body: "This is the body",
        }, {
            to: "ExponentPushToken[bWx33iCW7hAkBeWX3u6SkR]",
            title: "MyTitle2",
            body: "This is the body2",
        }];

        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pushNotif)
        }).then(res => res.json()).then(data=> {
            console.log(data);
        })

        
    };

    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                console.log("ASK")
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = await Notifications.getExpoPushTokenAsync();
            console.log(token);
            // this.setState({ expoPushToken: token });
            setToken(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            console.log("setting channel")
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        Notifications.getNotificationChannelsAsync().then(arr => {
            // console.log(arr); 
        })
    };

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
            <Text style={styles.title}> Medications </Text>
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
        top: screenHeight * 0.38
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