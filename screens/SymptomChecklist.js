import React, { useState, useContext,useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, StyleSheet, Button } from 'react-native';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import CheckBox from '@react-native-community/checkbox';
import Background from '../components/background';

import PatientStyles from '../styles/PatientStyleSheet';

import MenuIcon from '../assets/images/menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';

import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import VeryDissatisfiedIcon from '../assets/images/scale-very-dissatisfied-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';
import NeutralIcon from '../assets/images/scale-neutral-icon.svg';
import SatisfiedIcon from '../assets/images/scale-satisfied-icon.svg';
import VerySatisfiedIcon from '../assets/images/scale-very-satisified-icon.svg';

const SymptomChecklist = ({navigation}) => {
    const DISCOMFORT_AREAS = ['Head', 'Chest', 'Stomach', 'Back', 'Other'];
    const DISCOMFORT_TYPES = ['Sore', 'Burning', 'Sudden', 'Severe', 'Tightness/Pressure', 'Sharp', 'Other'];

    const [feeling, setFeeling] = useState('Not Selected');
    const [additionalDetails, setAdditionalDetails] = useState('Additional Details.');
    const [discomfortAreas, setDiscomfortAreas] = useState([]);
    const [additionalAreas, setAdditionalAreas] = useState('Additional Details.');
    const [discomfortTypes, setDiscomfortTypes] = useState([]);
    const [additionalTypes, setAdditionalTypes] = useState('Additional Details.');
    
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
            setDiscomfortTypes(Array.from(selectedTypes));
            return;
          } else {
            console.log("error");
            return;
          }
        } else {
            selectedType.add(index);
            setDiscomfortTypes(Array.from(selectedTypes));
        }
    }

    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
            <View style={styles.rowContainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <ReturnIcon/>
                    </TouchableOpacity>
                    <Text style={[PatientStyles.title, {paddingHorizontal: 5}]}>
                        Symptom Checklist
                    </Text>
                </View>
                <ClipboardIcon/>
            </View>
            <ScrollView>
                <Text style={styles.questionFont}>How are you feeling?</Text>
                <View style={styles.rowContainer}>
                    <TouchableOpacity onPress={()=>setFeeling('Terrible')}><VeryDissatisfiedIcon/></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setFeeling('Not Well')}><DissatisfiedIcon/></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setFeeling('Neutral')}><NeutralIcon/></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setFeeling('Okay')}><SatisfiedIcon/></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setFeeling('Better')}><VerySatisfiedIcon/></TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>Terrible</Text>
                    <Text>Better</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical:5}}>
                    <Text style={styles.questionFont}>Are you feeling any discomfort?</Text>
                    <TouchableOpacity><Text>YES</Text></TouchableOpacity>
                    <TouchableOpacity><Text>NO</Text></TouchableOpacity>
                </View>
                <Text style={styles.questionFont}>Where are you experiencing the pain or discomfort?</Text>
                <View style={{flexDirection:'row'}}>
                {DISCOMFORT_AREAS.map((area, index) => (
                    <View key={area} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox value={selectedArea.has(index)} onValueChange={()=>onSelectArea(index)} />
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
                    <CheckBox value={selectedType.has(index)} onValueChange={()=>onSelectType(index)} />
                    <Text> {type} </Text>
                    </View>
                ))}
                </View>
                <View style={styles.singleLineInput}>
                    <TextInput onChangeText={text=> setAdditionalTypes(text)} value={additionalTypes}/>
                </View>
                <View style={{paddingVertical: 5}}/>
                <Text style={styles.questionFont}>Additional details you would like your health professional to know. More details can help your health professional give you better care or treatment. </Text>
                <View style={{padding: 2}}/>
                <View style={styles.textInputBox}>
                    <TextInput
                        multiline 
                        numberOfLines={5}
                        onChangeText={text=> setAdditionalDetails(text)}
                        value={additionalDetails}
                        />
                </View>
                <View style={{padding: 5}}/>
            </ScrollView>
            <Button title="SUBMIT SYMPTOM CHECKLIST" color="#42C86A" onPress={()=>console.log("Symptom Checklist Submitted")} /> 
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
    }
});
export default SymptomChecklist;