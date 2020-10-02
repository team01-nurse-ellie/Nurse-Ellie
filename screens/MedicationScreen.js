import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Button, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon.svg';
import EditIcon from '../assets/images/edit-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import EntryIcon from '../assets/images/entry-triangle-icon.svg';
import MedicationIcon from '../assets/images/pink-medication-icon.svg';

const MedicationScreen = ({navigation}) => {
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <View>
                <Text style={styles.headerFont}>
                    <TouchableOpacity style={styles.button}><ReturnIcon/></TouchableOpacity>Monopril<TouchableOpacity style={styles.editButton}><EditIcon/></TouchableOpacity>
                </Text>
                
            </View>
            
            <MedicationIcon/>
            <Text> 10:00AM </Text>
            <Text style={styles.subheadingFont}>Prescription</Text>
            <Text style={styles.subheadingFont}>Information</Text>
            <Text style={styles.subheadingFont}>Possible Side Effects</Text>
            <Text style={styles.descriptionFont}>Not feeling well after taking this medication?</Text>
            <Text style={styles.descriptionFont}>Report it to your Health Professional</Text>
            <TouchableOpacity>
                <Text style={styles.clickableFont}>SYMPTOM CHECKLIST</Text>
            </TouchableOpacity>
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
        width: screenWidth
    },
    subheadingFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 24, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)'
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
    button: { 
        height: 15, 
        width: 15
    }, 
    editButton: {
        height: 15, 
        width: 15, 
        position: 'absolute',
        right: 10
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

export default MedicationScreen;