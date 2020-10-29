import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Button, Dimensions, StyleSheet, Platform, } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon.svg';

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


    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.button} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={styles.time}> {greeting} </Text>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <Text style={styles.title}> Medications </Text>
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
    }
})