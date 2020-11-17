import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Unorderedlist from 'react-native-unordered-list';
import { ScrollView } from 'react-native-gesture-handler';

import Background from '../components/background';
import MedIconIndex from '../components/MedicationImages';
import MenuIcon from '../assets/images/menu-icon.svg';
import EditIcon from '../assets/images/edit-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import EntryIcon from '../assets/images/entry-triangle-icon.svg';
import { medObject} from '../utils/medication';

const MedicationDetailScreen = ({route, navigation}) => {
    const { item } = route.params;
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />

            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
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
                <Text style={styles.timeFont}> {item.medication.intakeTime} </Text>
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
            <Text style={styles.descriptionFont}>Not feeling well after taking this medication?</Text>
            <Text style={styles.descriptionFont}>Report it to your Health Professional</Text>
            <TouchableOpacity>
                <Text style={styles.clickableFont}>SYMPTOM CHECKLIST</Text>
            </TouchableOpacity>
            </ScrollView>
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
        //position: 'absolute', 
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
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)', 
    },
    medicationInfoView: {
        width: 170,
        paddingHorizontal: 10
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14, 
    },
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
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
})

export default MedicationDetailScreen;