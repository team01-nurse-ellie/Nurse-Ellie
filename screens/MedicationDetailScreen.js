import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Unorderedlist from 'react-native-unordered-list';
import { ScrollView } from 'react-native-gesture-handler';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import MedIconIndex from '../components/MedicationImages';
import MenuIcon from '../assets/images/menu-icon.svg';
import EditIcon from '../assets/images/edit-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import EntryIcon from '../assets/images/entry-triangle-icon.svg';
import { getValueFormatted } from '../utils/timeConvert';

const MedicationDetailScreen = ({route, navigation}) => {
    const { item } = route.params;
    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
            <ScrollView>
            <View style={styles.rowContainer}>
                <TouchableOpacity styes={styles.headerGoBack} onPress={()=> navigation.goBack()}>
                    <ReturnIcon/>
                </TouchableOpacity>
                <Text style={styles.headerFont}>
                    {item.medication.nameDisplay}
                </Text>
                <TouchableOpacity style={styles.headerEdit} onPress={()=> navigation.navigate("EditMedication", {item: item})}>
                    <EditIcon/>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', paddingVertical: 15}}>
                {MedIconIndex.index[item.medication.medIcon]}
            </View>
            <View style={{alignItems: 'center', marginBottom: 7}}>
                <Text style={styles.timeFont}> {getValueFormatted(item.medication.intakeTime)} </Text>
            </View>
            <Text style={styles.subheadingFont}>Prescription</Text>
                <Unorderedlist bulletUnicode={0x2023}> 
                    <Text>{item.medication.strength} {item.medication.doseForm} </Text>
                </Unorderedlist>
                <Unorderedlist bulletUnicode={0x2023}> 
                    <Text>{item.medication.directions}</Text>
                </Unorderedlist>
            <View style={{paddingVertical:10}}/>
            <Text style={styles.subheadingFont}>Information</Text>
            <Text>{item.medication.information}  </Text>
            <View style={{paddingVertical:10}}/>
            <Text style={styles.subheadingFont}>Possible Side Effects</Text>
                {item.medication.adverseEvents.length == 0 ? (
                <>
                <Unorderedlist><Text>dry cough</Text></Unorderedlist>
                <Unorderedlist><Text>vomiting</Text></Unorderedlist>
                <Unorderedlist><Text>tired feeling</Text></Unorderedlist>
                <Unorderedlist><Text>runny or stuffy nose</Text></Unorderedlist>
                <Unorderedlist><Text>headache</Text></Unorderedlist>
                <Unorderedlist><Text>nausea</Text></Unorderedlist>
                </>
                ) : (
                <>
                
                {item.medication.adverseEvents.map((event, index) => (
                <Unorderedlist key={index}>
                  <Text> {event} </Text>
                </Unorderedlist>
                ))}

                </>
                )}

            <View style={{paddingVertical:10}}/>
            <Text style={PatientStyles.descriptionFont}>Not feeling well after taking this medication?</Text>
            <Text style={PatientStyles.descriptionFont}>Report it to your Health Professional</Text>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={PatientStyles.clickableFont}>SYMPTOM CHECKLIST</Text><EntryIcon style={{paddingHorizontal: 8}}/>
            </TouchableOpacity>
            </ScrollView>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingVertical: 7
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100", 
        paddingHorizontal: 5,
        paddingVertical: 0,
        flexWrap: 'wrap',
        flex:9,
    },
    headerGoBack: {
        flex: 1,
        justifyContent: "flex-end",
    },
    headerEdit: {
        flex: 1
    },
    subheadingFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 24, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    timeFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 28, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    medicationInfoView: {
        width: 170,
        paddingHorizontal: 10
    },
})

export default MedicationDetailScreen;