import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, Button, Dimensions, StyleSheet, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/BackgroundHP';
import MedicationCard from '../components/MedicationCard';

import MenuIcon from '../assets/images/hp-menu-icon';
import SearchIcon from '../assets/images/search-icon';

import TempAvatar from '../assets/images/sm-temp-avatar';

const PatientListScreen = ({navigation}) => {
    const [patients, setPatients] = useState ([
        {patientName: 'Julie Ng', lastSeen: 'Tuesday, October 13th 2020', key: '1'}, 
        {patientName: 'Patrick Henderson', lastSeen: 'Wednesday, October 14th 2020', key: '2'}, 
        {patientName: 'Lee Follis', lastSeen: 'Monday, October 12th 2020', key: '3'},
        {patientName: 'Mary Burns', lastSeen: 'Wednesday, October 14th 2020', key: '4'}
    ]);

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Patients
                    </Text>
                </View>
                <View style={styles.searchInput}>
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Patient List..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching for patient...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                <FlatList data={patients} renderItem={({item}) => (
                    <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('Patient', {item: item})}>
                        <MedicationCard>
                            <View>
                                <TempAvatar />
                            </View>
                            <View style={styles.patientInfoView}>
                                <Text style={styles.patientFont}>{item.patientName}</Text>
                                <Text style={styles.lastSeenFont}>Last Seen: {item.lastSeen}</Text>
                            </View>
                        </MedicationCard>
                    </TouchableOpacity>
                )}/>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#4285C8',
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
    patientFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    lastSeenFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    patientInfoView: {
        width: 260,
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

export default PatientListScreen;