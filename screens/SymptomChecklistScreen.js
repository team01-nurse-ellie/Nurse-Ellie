import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput,Image, StyleSheet, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import CheckBox from '@react-native-community/checkbox';
import Background from '../components/background';
import { Card, CardItem } from 'native-base'

import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import VeryDissatisfiedIcon from '../assets/images/scale-very-dissatisfied-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';
import NeutralIcon from '../assets/images/scale-neutral-icon.svg';
import SatisfiedIcon from '../assets/images/scale-satisfied-icon.svg';
import VerySatisfiedIcon from '../assets/images/scale-very-satisified-icon.svg';


const SymptomChecklistScreen = ({ navigation }) => {

    /** Get feelings */
    const [headSelected, setHeadSelection] = useState(false);
    const [chestSelected, setChestSelection] = useState(false);
    const [stomachSelected, setStomachSelection] = useState(false);
    const [backSelected, setBackSelection] = useState(false);
    const [otherSelected, setOtherSelection] = useState(false);

    const [achySelected, setAchySelection] = useState(false);
    const [burningSelected, setBurningSelection] = useState(false);
    const [suddenSelected, setSuddenSelection] = useState(false);
    const [severeSelected, setSevereSelection] = useState(false);
    const [squeezingSelected, setSqueezingSelection] = useState(false);
    const [sharpSelected, setSharpSelection] = useState(false);
    const [other2Selected, setOther2Selection] = useState(false);


    /**Additional Detail value */
    const [additionalText, getAdditionalText] = useState('');
    const setAdditionalText=(enteredText)=>{
        getAdditionalText(enteredText);

    }

    /** Button Clicked Function */
    const getFormValue=()=>{
        
        
        headSelected == true ? console.log('Head YES') : console.log('Head NO');
        chestSelected == true ? console.log('Chest YES') : console.log('Chest NO');
        stomachSelected == true ? console.log('Stomach YES') : console.log('Stomach NO');
        backSelected == true ? console.log('Back YES') : console.log('Back NO');
        otherSelected == true ? console.log('Other YES') : console.log('Other NO');

        achySelected == true ? console.log('Achy YES') : console.log('Achy NO');
        burningSelected == true ? console.log('Burning YES') : console.log('Burning NO');
        suddenSelected == true ? console.log('Sudden YES') : console.log('Sudden NO');
        severeSelected == true ? console.log('Severe YES') : console.log('Severe NO');
        squeezingSelected == true ? console.log('Squeezing YES') : console.log('Squeezing NO');
        sharpSelected == true ? console.log('Sharp YES') : console.log('Sharp NO');
        other2Selected == true ? console.log('Other2 YES') : console.log('Other2 NO');

        console.log(additionalText);

    }

    return (
        <>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
            
            <View>  
                <View style={styles.screenHeader}>
                    <Text style={styles.headerFont}>
                        {`Symptom Checklist`}
                    </Text>
                    <ClipboardIcon style={styles.headerImage} />
                </View> 

                <View style={styles.feelingView}>
                    <Text style={styles.simpleText}>
                        { `How are you feeling?` }
                    </Text>

                    <View style={styles.feelingIcons}>
                        <ClipboardIcon />
                        <ClipboardIcon />
                        <ClipboardIcon />
                        <ClipboardIcon />
                        <ClipboardIcon />
                    </View>

                    <View style={styles.feelingWords}>
                        <Text style={styles.simpleText}>
                            { `Terrible` }
                        </Text>
                        <Text style={styles.simpleText}>
                            { `Better` }
                        </Text>
                    </View>
                </View>

                <View style={styles.feelingPain}>
                    <Text style={styles.simpleText}>
                        {`Are you feeling any pain or discomfort?`}
                    </Text>

                    <View style={styles.feelingYesNo}>
                        <Text style={styles.feelingNo}>
                            {`YES`}
                        </Text>
                        <Text style={styles.feelingNo}>
                            {`NO`}
                        </Text>
                    </View>
                </View>

                <View style={styles.discomfortView}>
                    <Text style={styles.simpleText}>
                        {`Where are you experiencing the pain or discomfort?`}
                    </Text>


                    <View style={styles.discomfortCheckView}>
                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={headSelected}
                                onValueChange={setHeadSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Head</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={chestSelected}
                                onValueChange={setChestSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Chest</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={stomachSelected}
                                onValueChange={setStomachSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Stomach</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={backSelected}
                                onValueChange={setBackSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Back</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={otherSelected}
                                onValueChange={setOtherSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Other</Text>
                        </View>
                    </View>




                    <TextInput style={styles.inputText2}
                        numberOfLines={1}
                    />
                </View>

              
                <View style={styles.discomfortView}>
                    <Text style={styles.simpleText}>
                        {'How would you describe the pain or discomfort you are experiencing?'}
                    </Text>

                    <View style={styles.discomfortCheckView}>
                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={achySelected}
                                onValueChange={setAchySelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Achy or gnawing</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={burningSelected}
                                onValueChange={setBurningSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Burning</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={suddenSelected}
                                onValueChange={setSuddenSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Sudden</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={severeSelected}
                                onValueChange={setSevereSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Severe</Text>
                        </View>
                    </View>

                    <View style={styles.discomfortCheckView}>
                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={squeezingSelected}
                                onValueChange={setSqueezingSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Squeezing or pressure</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={sharpSelected}
                                onValueChange={setSharpSelection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Sharp</Text>
                        </View>

                        <View style={styles.discomfortCheckSubView}>
                            <CheckBox
                                value={other2Selected}
                                onValueChange={setOther2Selection}
                                style={styles.checkbox}
                            />
                            <Text style={styles.simpleText}> Other</Text>
                        </View>

                    </View>


                    <TextInput style={styles.inputText2}
                        numberOfLines={1}
                    />
                </View>
              

   
  

                <Text style={styles.simpleText}>
                    {`Additional details you would like your health professional know.  More details can help your health professional give you better care or treatment.`}
                </Text>

                <TextInput 
                    style={styles.inputText}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={setAdditionalText}
                    value={additionalText}
                />

                <Button title="SUBMIT" color="#42C86A"
                    onPress={getFormValue}
                />

            </View>

            </Animatable.View>
        </>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({

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
        paddingTop: 2,
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
        flexDirection: 'row',
    },

    feelingYesNo: {
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent: 'space-evenly',

        fontFamily: 'roboto-medium',
        color: 'grey'
    },

    feelingNo: {
        marginLeft: 25,
    },

    discomfortView: {
        marginTop: 2,
    },

    inputText:{
        marginTop: 2,
        marginBottom: 5,
        borderColor: '#42C86A',
        borderWidth: 1
    },

    discomfortCheckView:{
        flexDirection: 'row',
    },

    discomfortCheckSubView:{
        flexDirection: 'row',
        marginRight: 5,
        textAlignVertical: "center",
    },

    //////

    simpleText: {
        fontFamily: 'roboto-medium',
        fontSize: 12.5,
        color: 'grey',
    },

    underline: {
        textDecorationLine: 'underline'
    },



    submitButtonText:{
        color: 'white',
    },


 


    inputText2:{
        borderBottomColor: '#42C86A',
        borderBottomWidth: 1
    }

});

export default SymptomChecklistScreen;