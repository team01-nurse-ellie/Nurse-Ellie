import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';
import { firebase } from '../components/Firebase/config';

import * as Animatable from 'react-native-animatable';

import MedIconIndex from '../components/MedicationImages';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon.svg';
import SearchIcon from '../assets/images/search-icon.svg';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { ActivityIndicator } from 'react-native-paper';

const MedicationListScreen = ({navigation}) => {
    const { currentUser } = useContext(FirebaseAuthContext);
    const [medications, setMedications] = useState ([
        {medicationName: 'Monopril', function: 'High Blood Pressure', frequency: '1x/day', alert: '10:00AM', key: '1'}, 
        {medicationName: 'Cymbalta', function: 'Joint Pain', frequency: '1x/day', alert: '9:00AM', key: '2'}, 
        {medicationName: 'Codeine', function: 'Cough & Cold', frequency: '15ml/day', alert: '10:00AM', key: '3'},
    ])
    const [newMedications, setNewMedications] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        //collection listener, initializes local state with all user medication
        const listener = firebase.firestore()
            .collection("users")
            .doc(currentUser.uid)
            .collection("medications")
            .onSnapshot(querySnapshot => {
                const meds = [];
                querySnapshot.forEach(documentSnapshot =>{
                    let id = documentSnapshot.id;
                    let data = documentSnapshot.data();
                    meds.push({
                        'docId' : id,
                        'medication': data,
                    })
                });
                setNewMedications(meds);
                setLoading(false);
            });
        // unsubscribe from events when no longer in use
        //return () => listener();
    }, []);


    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
                <View style={PatientStyles.header}>
                    <Text style={PatientStyles.title}>
                        Medications
                    </Text>
                    <MedicationsIcon/>
                </View>
                <View style={styles.searchInput}>
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Medication..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching medication...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                { loading ? (
                    <View style={{padding:screenHeight *.5}}>
                        <ActivityIndicator/>
                    </View>
                ) : (
                    <FlatList 
                        data={newMedications.sort( (a,b) => {
                            return a.medication.nameDisplay.localeCompare(b.medication.nameDisplay);
                        })} 
                        keyExtractor={(item) => item.docId}
                        renderItem={({item}) => (
                        <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Medication', {item: item})}>
                            <MedicationCard>
                                <View style={{justifyContent:'center', paddingHorizontal:6, width: 60}}>
                                    {MedIconIndex.index[item.medication.medIcon]}
                                </View>
                                <View style={styles.medicationInfoView}>
                                <Text style={styles.medicationFont}>{item.medication.nameDisplay}</Text>
                                {/*  <Text style={styles.functionFont}>no simple function in db yet</Text> */}
                                <Text style={styles.frequencyfont}>{item.medication.strength}</Text>
                                </View>
                                <View style={styles.timeView}>
                                    <Text style={styles.timeFont}>{item.medication.intakeTime}</Text>
                                </View>
                            </MedicationCard>
                        </TouchableOpacity>
                    )}/>
                )}
                <Button title="ADD NEW MEDICATION" color='#42C86A' onPress={()=>{navigation.navigate('AddMedication'); console.log(JSON.stringify(newMedications[0]));}}/>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    medicationFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    functionFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    frequencyfont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    timeFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    medicationInfoView: {
        width: 170,
        paddingHorizontal: 10
    },
    timeView:{
        borderLeftColor: 'rgba(0, 0, 0, 0.33)', 
        borderLeftWidth: 1,
        paddingHorizontal: 15, 
        justifyContent: 'center', 
        width: 100
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
});

export default MedicationListScreen;