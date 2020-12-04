import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import CheckBox from '@react-native-community/checkbox';
import BackgroundHP from '../components/BackgroundHP';
import MenuIcon from '../assets/images/hp-menu-icon';

import VeryDissatisfiedIcon from '../assets/images/scale-very-dissatisfied-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';
import NeutralIcon from '../assets/images/scale-neutral-icon.svg';
import SatisfiedIcon from '../assets/images/scale-satisfied-icon.svg';
import VerySatisfiedIcon from '../assets/images/scale-very-satisified-icon.svg';
import { firebase } from '../components/Firebase/config';


const pSymptomChecklistScreen = ({ route, navigation }) => {

    const { item } = route.params;
    
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <BackgroundHP />

            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">

                <ScrollView >
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style = {styles.crossIcon}> X </Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.screenHeader } >
                        <Text style = { styles.headerFont } > 
                            { `Symptom Checklist` } 
                        </Text> 
                    </View>

                    <View style = { styles.feelingView } >
                        <Text style = { styles.simpleText } > 
                            { `How are you feeling?` } 
                        </Text>
                        
                        <View style = { styles.feelingIcons } >
                            <VeryDissatisfiedIcon fill = "#000000" / >
                            <DissatisfiedIcon fill = "#000000" / >
                            <NeutralIcon fill = "#000000" / >
                            <SatisfiedIcon fill = "#000000" / >
                            <VerySatisfiedIcon fill = "#000000" / >
                        </View>

                        <View style = { styles.feelingWords } >
                            <Text style = { styles.simpleText } > 
                                { `Terrible` } 
                            </Text> 
                            <Text style = { styles.simpleText } > 
                                { `Better` } 
                            </Text> 
                        </View> 
                    </View>

                    <View style = { styles.feelingPain } >
                        <Text style = { styles.simpleText } > 
                            { `Are you feeling any pain or discomfort?` } 
                        </Text>

                        <View style = { styles.feelingYesNo } >
                            <Text style = { styles.feelingPressed } > 
                                { `YES` } 
                            </Text> 
                            
                            <Text style = { styles.feelingNo } > 
                                { `NO` } 
                            </Text>  
                        </View> 
                    </View>

                    <View style = { styles.discomfortView } >
                        <Text style = { styles.simpleText } > 
                            { `Where are you experiencing the pain or discomfort?` } 
                        </Text>

                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                < CheckBox value = { item.headSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Head </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.chestSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Chest </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.stomachSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Stomach </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.backSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Back </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.otherSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Other </Text> 
                            </View> 
                        </View>

                        <TextInput style = { styles.inputText2 }
                            numberOfLines = { 1 }
                            onChangeText={(text) => setLineOneText(text)}
                            value={ item.inputLineOneText }
                        /> 
                        
                    </View>

                    <View style = { styles.discomfortView } >
                        <Text style = { styles.simpleText } > 
                            { 'How would you describe the pain or discomfort you are experiencing?' } 
                        </Text>

                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.achySelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Achy or gnawing </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.burningSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Burning </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.suddenSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Sudden </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.severeSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Severe </Text> 
                            </View> 
                        </View>

                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.squeezingSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Squeezing or pressure </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.sharpSelected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Sharp </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { item.other2Selected }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Other </Text> 
                            </View>
                        </View>

                        <TextInput
                            style = { styles.inputText2 }
                            multiline = { true }
                            value={ item.inputLineTwoText }
                        /> 
                    </View>

                    <Text style = { styles.simpleText } > 
                        { `Additional details you would like your health professional know.  More details can help your health professional give you better care or treatment.` } 
                    </Text>

                    <TextInput style = { styles.inputText }
                        multiline = { true }
                        numberOfLines = { 5 }
                        value={ item.additionalText }
                    />
                </ScrollView>

            </Animatable.View> 
        </KeyboardAvoidingView>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({

    background: {
        flex: 1,
        backgroundColor: '#4285C8',
    }, 

    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
    },

    crossIcon:{
        left: 300,
        fontSize: 32,
        color: 'grey',
        paddingBottom: 0,
        paddingTop: 0,
        marginBottom: 0,
        marginTop: 0,
    },

    drawer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        bottom: 0,
        //justifyContent: 'space-between'
    },



    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100",
    },

    headerImage: {
        left: 30,
    },

    feelingView: {
        paddingTop: 5,
    },

    feelingIcons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    feelingWords: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
    },

    feelingPain: {
        paddingRight: 80,
        flexDirection: 'row',
    },

    feelingYesNo: {
        marginLeft: 25,
        flexDirection: 'row',

        fontFamily: 'roboto-medium',
        color: 'grey'
    },

    feelingNo: {
        marginLeft: 25,
    },

    feelingPressed: {
        color: 'red',
        fontWeight: "bold",
    },

    feelingNotPressed: {
        color: 'grey',
        fontWeight: "bold",
    },

    discomfortView: {
        marginTop: 2,
    },

    inputText: {
        marginTop: 2,
        marginBottom: 5,
        borderColor: '#42C86A',
        borderWidth: 1,

    },

    lastButton: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },

    discomfortCheckView: {
        flexDirection: 'row',
    },

    discomfortCheckSubView: {
        flexDirection: 'row',
        //marginRight: 5,
        //textAlignVertical: "center",
    },


    simpleText: {
        fontFamily: 'roboto-medium',
        fontSize: 13,
        color: 'grey',
        lineHeight: 20,
        marginBottom: 10,
    },

    simpleTextF: {
        fontFamily: 'roboto-medium',
        fontSize: 12,
        color: 'grey',
        lineHeight: 30,
    },

    underline: {
        textDecorationLine: 'underline'
    },



    submitButtonText: {
        color: 'white',
    },


    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
    },


    inputText2: {
        borderBottomColor: '#42C86A',
        borderBottomWidth: 1,
        marginBottom: 10,
    }

});

export default pSymptomChecklistScreen;