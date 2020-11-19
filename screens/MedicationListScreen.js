import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';
import { firebase } from '../components/Firebase/config';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux'

import MedIconIndex from '../components/MedicationImages';
import Background from '../components/background';
import MedicationCard from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon.svg';
import SearchIcon from '../assets/images/search-icon.svg';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { getValueFormatted } from '../utils/timeConvert';
import { ActivityIndicator } from 'react-native-paper';

const MedicationListScreen = ({navigation}) => {
    const { currentUser } = useContext(FirebaseAuthContext);
    const [docid, setDocid ] = useState();
    const [newMedications, setNewMedications] = useState([]);
    const [loading,setLoading] = useState(true);

    //useSelector(state => setDocid(state));

    useEffect(() => {
        // Access Redux state
        //collection listener, initializes local state with all user medication
        firebase.firestore()
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
    }, []);


    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
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
    background: {
        flex: 1,
        backgroundColor: '#42C86A',
    }, 
    header:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 10
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    }, 
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
        fontSize: 16, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)', 
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
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
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
        top: screenHeight * 0.15
    }
});

export default MedicationListScreen;