import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import CheckBox from '@react-native-community/checkbox';
import Background from '../components/background';

import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import VeryDissatisfiedIcon from '../assets/images/scale-very-dissatisfied-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';
import NeutralIcon from '../assets/images/scale-neutral-icon.svg';
import SatisfiedIcon from '../assets/images/scale-satisfied-icon.svg';
import VerySatisfiedIcon from '../assets/images/scale-very-satisified-icon.svg';
import { firebase } from '../components/Firebase/config';


const SymptomChecklistScreen = ({ navigation }) => {

    // Variable to store value of 'HOW ARE YOU FEELING EMOTIONAL ICONS'
    let emotions_icon_value = 'No Feelings';

    const emotionClicked = (value) => {
        console.log("==>inside value: " + value);
        if (value == 'VDI') {
            emotions_icon_value = 'Terrible'
        } else if (value == 'DI') {
            emotions_icon_value = 'Not Good'
        } else if (value == 'NI') {
            emotions_icon_value = 'Okay'
        } else if (value == 'SI') {
            emotions_icon_value = 'Good'
        } else if (value == 'VSI') {
            emotions_icon_value = 'Better'
        }
        console.log("==>inside value: " + emotions_icon_value);
    }

    //Having Pain or Discomfort
    let pain_Discomfort = 'No';
    const havingPain = (value) => {
        if (value == 'YES') {
            pain_Discomfort = 'Yes';
        } else {
            pain_Discomfort = 'No';
        }
    }

    /** Get Experiencing the pain or discomfort */
    const [headSelected, setHeadSelection] = useState(false);
    const [chestSelected, setChestSelection] = useState(false);
    const [stomachSelected, setStomachSelection] = useState(false);
    const [backSelected, setBackSelection] = useState(false);
    const [otherSelected, setOtherSelection] = useState(false);
    const [inputLineOneText, setLineOneText] = useState('');

    const [achySelected, setAchySelection] = useState(false);
    const [burningSelected, setBurningSelection] = useState(false);
    const [suddenSelected, setSuddenSelection] = useState(false);
    const [severeSelected, setSevereSelection] = useState(false);
    const [squeezingSelected, setSqueezingSelection] = useState(false);
    const [sharpSelected, setSharpSelection] = useState(false);
    const [other2Selected, setOther2Selection] = useState(false);
    const [inputLineTwoText, setLineTwoText] = useState('');

    /**Additional Detail value */
    const [additionalText, setAdditionalText] = useState('');

    /** Button Clicked Function */
    const symptomRef = firebase.firestore().collection('symptom')

    const getFormValue = async(res) => {
        let current_date = new Date();

        const patient_id = await firebase.auth().currentUser.uid
        

        const obj = {
            current_date,
            patient_id,
            emotions_icon_value,
            pain_Discomfort,
    
            headSelected,
            chestSelected,
            stomachSelected,
            backSelected,
            otherSelected,
            inputLineOneText,
    
            achySelected,
            burningSelected,
            suddenSelected,
            severeSelected,
            squeezingSelected,
            sharpSelected,
            other2Selected,
            inputLineTwoText,
    
            additionalText,
        };

        const symptomRef = firebase.firestore().collection('symptom')
        symptomRef.add(obj)


        /** printing codes */
        console.log("\n------------------\n");
        console.log("its uid: " + patient_id);
        console.log("Date: " + current_date);
        console.log('Emotion Icons Value: ' + emotions_icon_value);
        console.log('Having Pain or Discomfort: ' + pain_Discomfort);

        headSelected == true ? console.log('Head YES') : console.log('Head NO');
        chestSelected == true ? console.log('Chest YES') : console.log('Chest NO');
        stomachSelected == true ? console.log('Stomach YES') : console.log('Stomach NO');
        backSelected == true ? console.log('Back YES') : console.log('Back NO');
        otherSelected == true ? console.log('Other YES') : console.log('Other NO');
        console.log("Input 01: " + inputLineOneText)

        achySelected == true ? console.log('Achy YES') : console.log('Achy NO');
        burningSelected == true ? console.log('Burning YES') : console.log('Burning NO');
        suddenSelected == true ? console.log('Sudden YES') : console.log('Sudden NO');
        severeSelected == true ? console.log('Severe YES') : console.log('Severe NO');
        squeezingSelected == true ? console.log('Squeezing YES') : console.log('Squeezing NO');
        sharpSelected == true ? console.log('Sharp YES') : console.log('Sharp NO');
        other2Selected == true ? console.log('Other2 YES') : console.log('Other2 NO');
        console.log("Input 02: " + inputLineTwoText)

        console.log("Additional Value: " + additionalText);

    }


    return (
        <>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">

                <ScrollView >
                    <View style = { styles.screenHeader } >
                        <Text style = { styles.headerFont } > 
                            { `Symptom Checklist` } 
                        </Text> 
                        <ClipboardIcon fill = "#000000" style = { styles.headerImage }/> 
                    </View>

                    <View style = { styles.feelingView } >
                        <Text style = { styles.simpleText } > 
                            { `How are you feeling?` } 
                        </Text>
                        
                        <View style = { styles.feelingIcons } >
                            <TouchableOpacity onPress = {() => emotionClicked('VDI') } >
                                <VeryDissatisfiedIcon fill = "#000000" / >
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => emotionClicked('DI') } >
                                <DissatisfiedIcon fill = "#000000" / >
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => emotionClicked('NI') } >
                                <NeutralIcon fill = "#000000" / >
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => emotionClicked('SI') } >
                                <SatisfiedIcon fill = "#000000" / >
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress = {() => emotionClicked('VSI') } >
                                <VerySatisfiedIcon fill = "#000000" / >
                            </TouchableOpacity> 
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
                            <TouchableOpacity onPress = {() => havingPain('YES') } >
                                <Text style = { styles.feelingPressed } > 
                                    { `YES` } 
                                </Text> 
                            </TouchableOpacity>

                            <TouchableOpacity onPress = {() => havingPain('NO') } >
                                <Text style = { styles.feelingNo } > 
                                    { `NO` } 
                                </Text> 
                            </TouchableOpacity> 
                        </View> 
                    </View>

                    <View style = { styles.discomfortView } >
                        <Text style = { styles.simpleText } > 
                            { `Where are you experiencing the pain or discomfort?` } 
                        </Text>
                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                < CheckBox value = { headSelected } 
                                    onValueChange = { setHeadSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Head </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { chestSelected }
                                    onValueChange = { setChestSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Chest </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { stomachSelected }
                                    onValueChange = { setStomachSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Stomach </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { backSelected }
                                    onValueChange = { setBackSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Back </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { otherSelected }
                                    onValueChange = { setOtherSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Other </Text> 
                            </View> 
                        </View>

                        <TextInput style = { styles.inputText2 }
                            numberOfLines = { 1 }
                            onChangeText={(text) => setLineOneText(text)}
                            value={ inputLineOneText }
                        /> 
                    </View>

                    <View style = { styles.discomfortView } >
                        <Text style = { styles.simpleText } > 
                            { 'How would you describe the pain or discomfort you are experiencing?' } 
                        </Text>

                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { achySelected }
                                    onValueChange = { setAchySelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Achy or gnawing </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { burningSelected }
                                    onValueChange = { setBurningSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Burning </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { suddenSelected }
                                    onValueChange = { setSuddenSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Sudden </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { severeSelected }
                                    onValueChange = { setSevereSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Severe </Text> 
                            </View> 
                        </View>

                        <View style = { styles.discomfortCheckView } >
                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { squeezingSelected }
                                    onValueChange = { setSqueezingSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Squeezing or pressure </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { sharpSelected }
                                    onValueChange = { setSharpSelection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Sharp </Text> 
                            </View>

                            <View style = { styles.discomfortCheckSubView } >
                                <CheckBox value = { other2Selected }
                                    onValueChange = { setOther2Selection }
                                    style = { styles.checkbox }
                                /> 
                                <Text style = { styles.simpleTextF } > Other </Text> 
                            </View>
                        </View>

                        <TextInput
                            style = { styles.inputText2 }
                            multiline = { true }
                            onChangeText={(text) => setLineTwoText(text)}
                            value={ inputLineTwoText }
                        /> 
                    </View>

                    <Text style = { styles.simpleText } > 
                        { `Additional details you would like your health professional know.  More details can help your health professional give you better care or treatment.` } 
                    </Text>

                    <TextInput style = { styles.inputText }
                        multiline = { true }
                        numberOfLines = { 5 }
                        onChangeText={(text) => setAdditionalText(text)}
                        value={ additionalText }
                    />

                    <Button title = "SUBMIT"
                        color = "#42C86A"
                        style = { styles.lastButton }
                        onPress = {
                            getFormValue
                        }
                    />

                </ScrollView>

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

export default SymptomChecklistScreen;