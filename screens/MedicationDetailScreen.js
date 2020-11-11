import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Unorderedlist from 'react-native-unordered-list';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedIconIndex from '../components/MedicationImages';
import MenuIcon from '../assets/images/menu-icon.svg';
import EditIcon from '../assets/images/edit-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import EntryIcon from '../assets/images/entry-triangle-icon.svg';

const MedicationDetailScreen = ({route, navigation}) => {
    const { item } = route.params;
    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <ReturnIcon/>
                </TouchableOpacity>
                <Text style={styles.headerFont}>
                    {item.medicationName}
                </Text>
                <TouchableOpacity onPress={()=> navigation.navigate("EditMedication")}>
                    <EditIcon/>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', paddingVertical: 15}}>
                {MedIconIndex.index[item.key]}
            </View>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.timeFont}> 10:00AM </Text>
            </View>
            <Text style={styles.subheadingFont}>Prescription</Text>
                <Unorderedlist bulletUnicode={0x2023}> 
                    <Text>40 mg (1 pill) daily</Text>
                </Unorderedlist>
                <Unorderedlist bulletUnicode={0x2023}> 
                    <Text>can be taken with or without food</Text>
                </Unorderedlist>
            <View style={{paddingVertical:10}}/>
            <Text style={styles.subheadingFont}>Information</Text>
            <Text> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  </Text>
            <View style={{paddingVertical:10}}/>
            <Text style={styles.subheadingFont}>Possible Side Effects</Text>
                <Unorderedlist><Text>dry cough</Text></Unorderedlist>
                <Unorderedlist><Text>vomiting</Text></Unorderedlist>
                <Unorderedlist><Text>tired feeling</Text></Unorderedlist>
                <Unorderedlist><Text>runny or stuffy nose</Text></Unorderedlist>
                <Unorderedlist><Text>headache</Text></Unorderedlist>
                <Unorderedlist><Text>nausea</Text></Unorderedlist>
            <View style={{paddingVertical:10}}/>
            <Text style={PatientStyles.descriptionFont}>Not feeling well after taking this medication?</Text>
            <Text style={PatientStyles.descriptionFont}>Report it to your Health Professional</Text>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={PatientStyles.clickableFont}>SYMPTOM CHECKLIST</Text><EntryIcon style={{paddingHorizontal: 8}}/>
            </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 7
    },
    heading: {
        flex: 1, 
        justifyContent: 'flex-end',
        position: 'absolute', 
        paddingHorizontal: 20, 
        paddingBottom: 5
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 26,
        fontWeight: "100", 
        position: 'absolute', 
        paddingHorizontal: 20,
        paddingVertical: 0
    },
    subheadingFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 24, 
        color: 'rgba(0, 0, 0, 0.85)'
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
})

export default MedicationDetailScreen;