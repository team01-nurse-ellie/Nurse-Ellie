import React, {useState, useEffect, useRef} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Button, Dimensions, StyleSheet, Platform, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressCircle from 'react-native-progress-circle';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { calculateLocalTimezone } from '../utils/dateHelpers';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        console.log(notification, "gggggggggg") 
        return ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        })

    },
    handleSuccess: (id) => {
        console.log(`${id} handled succ`)
    },
    handleError: (err) => {
        console.log(`${err} FAILED!`)
    }
});

const HomeScreen = ({ navigation }) => {

    const notificationListener = useRef();
    const responseListener = useRef();
    
    const [pushToken, setToken] = useState('');
    const [count, setCount] = useState(0);
    
    const [greeting, setGreeting] = useState('');

    const [medicationTaken, setMedicationTaken] = useState(0);
   
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
    ])

    useEffect(()=> {
        (async ()=> {
            let time = calculateLocalTimezone(1606435200000);
            console.log(time);
            await registerForPushNotificationsAsync()
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log(`====ReceivedListener====`);
                console.log(notification);
                console.log(`========================`);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(`====ResponseReceivedListener====`);
                console.log(response);
                console.log(`========================`); 
            });
            
            // await Notifications.getAllScheduledNotificationsAsync().then(t => {
    
                // console.log("SHOWING ALL NOTIFS")
                // console.log(t);
                
            // })


        })();
        
        // sendPushNotif();

        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
            // let alarmDate = new Date(Date.UTC(2020, 10, 18, 20, 41));
            // console.log(alarmDate.getTimezoneOffset());
            // console.log(new Date(Date.UTC(2020, 10, 18, 20, 41)))
            // console.log(Date.now() + 60 * 60 * 1000)
        };

    }, []);

    const scheduleAlarms = async () => {
     try {
         await Notifications.cancelAllScheduledNotificationsAsync().then(async () => {

             console.log(`***SCHEDULING ALARMS***`);
             let trigger = calculateLocalTimezone(2020, 11, 21, 10, 32, "PM");
             // let trig = calculateLocalTimezone(2020, 11, 19, 11, 0, "AM");
             // let trig2 = calculateLocalTimezone(2020, 11, 19, 12, 0, "AM")

            //  console.log(calculateLocalTimezone(2020, 11, 19, 11, 0, "AM"))
             await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Time's up!",
                  body: 'Change sides!',
                },
                trigger
              });

           
            //  await Notifications.scheduleNotificationAsync({
            //      content: {
            //          title: "ALARM TITLE #1",
            //          body: "ALARM BODY #1"
            //      },
            //      // trigger: new Date('2020-11-18T17:24:00'),
            //      trigger: {
            //          seconds: 2,
            //          repeats: true
            //         }
            //  }).then(async str => {
            //      console.log("added notif #1", str)
            //  });
 


             
            //  await Notifications.scheduleNotificationAsync({
            //      content: {
            //          title: "ALARM TITLE @2",
            //          body: "ALARM BODY @2"
            //      },
            //      trigger: calculateLocalTimezone(2020, 11, 19, 12, 0, "AM")
            //  }).then(async str => {
            //      console.log("added notif #2", str)
            //  });








             // await Notifications.getAllScheduledNotificationsAsync().then(t => {
     
             //     console.log("SHOWING ALL NOTIFS")
             //     console.log(t)
             // })
         });

     } catch (error) {
         throw error;
     }
        
      
    }

    const showNotifs = async () => {
        await Notifications.getAllScheduledNotificationsAsync().then(t => {
    
            console.log("=========================SHOWING ALL NOTIFS=========================")
            console.log(t);
            console.log(`====================================================================`);
        })
    }

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
            console.log(`Final status: ${finalStatus}`)
            // console.log(`status: ${status}`)
            console.log(`existingStatus: ${existingStatus}`)

            const token = await Notifications.getExpoPushTokenAsync();
            // console.log(token);
            // this.setState({ expoPushToken: token });
            setToken(token);
            // console.log("Got token.")
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            // console.log("setting channel")
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
            <TouchableOpacity style={styles.button} onPress={async () => await scheduleAlarms()}>
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
            <MedicationsIcon onPress={showNotifs}/>
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