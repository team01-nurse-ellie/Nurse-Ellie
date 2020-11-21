import React, {useState, useEffect, useContext} from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressCircle from 'react-native-progress-circle';

import * as Animatable from 'react-native-animatable';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';
import { firebase } from '../components/Firebase/config';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { getValueFormatted } from '../utils/timeConvert';


const HomeScreen = ({ navigation }) => {
    const { currentUser } = useContext(FirebaseAuthContext);
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState();
    const [medicationTaken, setMedicationTaken] = useState(0);
    const [medications, setMedications] = useState ();
    const [fullName, setfullName] = useState('');
    useEffect(()=> {
        var hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good morning');
        } else if (hours < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
        const medSubscriber = firebase.firestore().collection("users").doc(currentUser.uid
            ).collection("medications"
            ).onSnapshot(function(querySnapshot) {
                loadUserInfo();
            }
        );
        const nameSubscriber = firebase.firestore().collection("users").doc(currentUser.uid
            ).onSnapshot(function(querySnapshot) {
                loadUserInfo();
            }
        );
        // Unsubscribe from listener when no longer in use
        return () => {medSubscriber(); nameSubscriber();}
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
    // Load user's full name and current medications
    async function loadUserInfo() {
        const user = await firebase.firestore().collection("users").doc(currentUser.uid).get();
        setfullName(user.data().fullName);
        let meds = await fsFn.getCurrentMedications(currentUser.uid);
        setMedications(meds);
    }

    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
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
            <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10}}>
            <Text style={PatientStyles.title}> Medications </Text>
            <MedicationsIcon />
            </View>
            {medications ? (
                <FlatList 
                data={medications.sort((a,b)=>{
                    return a.nameDisplay.localeCompare(b.nameDisplay);
                })}
                keyExtractor={(item) => item.rxcui.toString()}
                renderItem={({item}) => (
                    <Swipeable 
                    renderLeftActions={takenAction} 
                    renderRightActions={dismissAction}>
                        <MedicationCard>
                            <View style={styles.medicationInfoView}>
                            <Text style={styles.medicationFont}>{item.nameDisplay}</Text>
                            <Text style={styles.frequencyfont}>{item.strength}</Text>
                            </View>
                            <View style={styles.timeView}>
                                <Text style={styles.timeFont}>{getValueFormatted(item.intakeTime)}</Text>
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