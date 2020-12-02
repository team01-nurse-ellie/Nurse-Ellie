import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';
import { firebase } from '../components/Firebase/config';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux'

import MedIconIndex from '../components/MedicationImages';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon.svg';
import SearchIcon from '../assets/images/search-icon.svg';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import { getValueFormatted } from '../utils/timeConvert';
import { ActivityIndicator } from 'react-native-paper';

const MedicationListScreen = ({navigation}) => {
    const { currentUser } = useContext(FirebaseAuthContext);
    const [newMedications, setNewMedications] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        // subscribe to user collection of medications
        const subscriber = firebase.firestore()
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
        // Unsubscribe from document when no longer in use
        return () => subscriber();
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
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Your Medications..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching medication...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                { loading ? (
                    <View style={{flex:1, justifyContent:'center', padding:screenHeight *.5}}>
                        <ActivityIndicator/>
                    </View>
                ) : (
                    <FlatList 
                        data={newMedications.sort( (a,b) => {
                            return a.medication.namePrescribe.localeCompare(b.medication.namePrescribe);
                        })}
                        keyExtractor={(item) => item.docId}
                        renderItem={({item}) => (
                        <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Medication', {item: item})}>
                            <MedicationCard>
                                <View style={{justifyContent:'center', paddingHorizontal:6, width: 60}}>
                                    {MedIconIndex.index[item.medication.medIcon]}
                                </View>
                                <View style={styles.medicationInfoView}>
                                <Text style={PatientStyles.medicationFont}>{item.medication.nameDisplay}</Text>
                                <Text style={styles.functionFont}>{item.medication.function}</Text>
                                <Text style={styles.frequencyfont}>{item.medication.strength}</Text>
                                </View>
                                <View style={styles.timeView}>
                                    <Text style={styles.timeFont}>{getValueFormatted(item.medication.intakeTime)}</Text>
                                </View>
                            </MedicationCard>
                        </TouchableOpacity>
                    )}/>
                )}
                <Button title="ADD NEW MEDICATION" color='#42C86A' onPress={()=>{navigation.navigate('AddMedication')}}/>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
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
        fontSize: 16, 
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