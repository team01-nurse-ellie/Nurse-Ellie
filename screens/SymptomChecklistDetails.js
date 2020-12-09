import React, { useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { ScrollView, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable'
import CheckBox from '@react-native-community/checkbox';

import Background from '../components/BackgroundHP';

import HProStyles from '../styles/HealthProfessionalStyleSheet';

import MenuIcon from '../assets/images/hp-menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import VeryDissatisfiedIcon from '../assets/images/scale-very-dissatisfied-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';
import NeutralIcon from '../assets/images/scale-neutral-icon.svg';
import SatisfiedIcon from '../assets/images/scale-satisfied-icon.svg';
import VerySatisfiedIcon from '../assets/images/scale-very-satisified-icon.svg';

const SymptomChecklistDetails = ({navigation, route}) => {
    const { item } = route.params;

    const FEELINGS = { TERRIBLE: 1, NOTWELL: 2, NEUTRAL: 3, OKAY: 4, BETTER: 5}
    const DISCOMFORT_AREAS = ['Head', 'Chest', 'Stomach', 'Back', 'Other'];
    const DISCOMFORT_TYPES = ['Sore', 'Burning', 'Sudden', 'Severe', 'Tightness/Pressure', 'Sharp', 'Other'];

    const [feeling, setFeeling] = useState(item.checklist.feeling);
    const [isDiscomfort, setDiscomfort] = useState(item.checklist.isDiscomfort);
    const [discomfortAreas, setDiscomfortAreas] = useState(item.checklist.discomfortAreas);
    const [additionalAreas, setAdditionalAreas] = useState(item.checklist.additionalAreas);
    const [discomfortTypes, setDiscomfortTypes] = useState(item.checklist.discomfortTypes);
    const [additionalTypes, setAdditionalTypes] = useState(item.checklist.additionalTypes);
    const [additionalDetails, setAdditionalDetails] = useState(item.checklist.additionalDetails);

    let selectedArea = new Set(discomfortAreas);
    let selectedType = new Set(discomfortTypes);
    
    var onSelectArea = index => {
        if (selectedArea.has(index)) {
          if (selectedArea.delete(index)){
            setDiscomfortAreas(Array.from(selectedArea));
            return;
          } else {
            console.log("error");
            return;
          }
        } else {
          selectedArea.add(index);
          setDiscomfortAreas(Array.from(selectedArea));
        }
    };

    var onSelectType = index => {
        if (selectedType.has(index)) {
          if (selectedType.delete(index)){
            setDiscomfortTypes(Array.from(selectedType));
            return;
          } else {
            console.log("error");
            return;
          }
        } else {
            selectedType.add(index);
            setDiscomfortTypes(Array.from(selectedType));
        }
    }

    return (
        <KeyboardAvoidingView style={HProStyles.background} behaviour="padding" enabled>
<           Text>{console.log(isDiscomfort)}</Text>
            <Background />
            <TouchableOpacity style={HProStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={HProStyles.drawer} animation="fadeInUpBig"> 
            <View style={styles.rowContainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <ReturnIcon/>
                    </TouchableOpacity>
                    <Text style={[HProStyles.title, {paddingHorizontal: 5}]}>
                        Symptom Checklist
                    </Text>
                </View>
                <ClipboardIcon/>
            </View>
            <ScrollView>
                <Text style={styles.questionFont}>How are you feeling?</Text>
                <View style={styles.rowContainer}>
                    <TouchableOpacity style={[styles.baseButton, feeling===1 && styles.selectedButton]}>
                        <VeryDissatisfiedIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.baseButton, feeling===2 && styles.selectedButton]}>
                        <DissatisfiedIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.baseButton, feeling===3 && styles.selectedButton]}>
                        <NeutralIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.baseButton, feeling===4 && styles.selectedButton]}>
                        <SatisfiedIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.baseButton, feeling===5 && styles.selectedButton]}>
                        <VerySatisfiedIcon/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>Terrible</Text>
                    <Text>Better</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical:5}}>
                    <Text style={styles.questionFont}>Are you feeling any discomfort?</Text>
                    <TouchableOpacity>
                        <Text style={[styles.baseText, isDiscomfort === true && styles.selectedText]}>YES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.baseText, isDiscomfort === false && styles.selectedText]}>NO</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.questionFont}>Where are you experiencing the pain or discomfort?</Text>
                <View style={{flexDirection:'row'}}>
                {DISCOMFORT_AREAS.map((area, index) => (
                    <View key={area} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox disabled={true} value={selectedArea.has(index)} onValueChange={()=>onSelectArea(index)} />
                    <Text> {area} </Text>
                    </View>
                ))}
                </View>
                <View style={styles.singleLineInput}>
                    <TextInput onChangeText={text=> setAdditionalAreas(text)} value={additionalAreas}/>
                </View>
                <View style={{paddingVertical: 5}}/>
                <Text style={styles.questionFont}>How would you describe the pain or discomfort?</Text>
                <View style={{flexDirection:'row', flexWrap: 'wrap'}}>
                {DISCOMFORT_TYPES.map((type, index) => (
                    <View key={type} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox disabled={true} value={selectedType.has(index)} onValueChange={()=>onSelectType(index)} />
                    <Text> {type} </Text>
                    </View>
                ))}
                </View>
                <View style={styles.singleLineInput}>
                    <TextInput editable={false} onChangeText={text=> setAdditionalTypes(text)} value={additionalTypes}/>
                </View>
                <View style={{paddingVertical: 5}}/>
                <Text style={styles.questionFont}>Additional details you would like your health professional to know. More details can help your health professional give you better care or treatment. </Text>
                <View style={{padding: 2}}/>
                <View style={styles.textInputBox}>
                    <TextInput
                        editable={false}
                        multiline 
                        numberOfLines={5}
                        onChangeText={text=> setAdditionalDetails(text)}
                        value={additionalDetails}
                        />
                </View>
                <View style={{padding: 5}}/>
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
    textInputBox: {
        borderColor: '#707070', 
        borderWidth: 1,
    }, 
    singleLineInput:{
        borderBottomColor: '#707070',
        borderBottomWidth: 1,
    }, 
    questionFont: {
        fontFamily: 'roboto-regular',
        fontSize: 15,
    }, 
    baseText: {
        fontFamily: 'roboto-medium',
        color: '#000000'
    }, 
    selectedText: {
        fontFamily: 'roboto-medium',
        color: '#4285C8'
    }, 
    baseButton: {
        borderRadius: 20
    }, 
    selectedButton: {
        backgroundColor: '#4285C8'
    }

});
export default SymptomChecklistDetails;