import React, { useState } from 'react';
import { View, Text, Switch, Modal, KeyboardAvoidingView, TouchableOpacity,Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import DayOfWeekPicker from '../components/DayOfWeekPicker';
import DatePicker from '../components/DatePicker';
import IconPicker from '../components/IconPicker';
import TimePicker from '../components/TimePicker';

import MenuIcon from '../assets/images/menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';

const EditMedicationScreen = ({ navigation }) => {

  const currentTime = new Date();
  const [medIcon, setMedIcon] = useState('1');
  const [selectDoW, setSelectDoW] = useState([]);
  const [selectTime, setSelectTime] = useState(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarm, setAlarm] = useState('false');
  const toggleSwitch = () => setAlarm(previousState => !previousState);
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
                <MenuIcon />
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.rowContainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=> navigation.goBack()}>
                            <ReturnIcon/>
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            Monopril
                        </Text>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate('EditMedication')}>
                        <Text style={styles.saveText}> SAVE </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 18 }} />
                <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                    <IconPicker selected={medIcon} onSelect={setMedIcon} />
                    <View style={{ paddingBottom: 18 }} />
                    <TimePicker value={selectTime} onSelect={setSelectTime} />
                </View>
                <View style={styles.bottomCard}>
                    <View>
                    <Text style={styles.fieldText}> Start </Text>
                    <Text style={styles.fieldText}> Days </Text>
                    <Text style={styles.fieldText}> End </Text>
                    <Text style={styles.fieldText}> Alarm </Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker selected={startDate} onSelect={setStartDate} placeholder="Start Date" />
                    </View>
                    <DayOfWeekPicker selected={selectDoW} onSelect={setSelectDoW} />
                    <View style={{ paddingBottom: 8 }}>
                        <DatePicker selected={endDate} onSelect={setEndDate} placeholder="End Date" />
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#42C86A' }}
                        thumbColor={alarm ? '#F4F3F4' : '#F4F3F4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={alarm}
                    />
                    </View>
                </View>
                <View style={{ paddingBottom: 14 }} />
                <TouchableOpacity>
                    <Text style={styles.deleteText}> DELETE MEDICATION </Text>
                </TouchableOpacity>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
};

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: '#42C86A',
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
        top: screenHeight * 0.15,
    },
    menuButton:{
        position: 'absolute',
        right: 30,
        top: 40 
    },
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingVertical: 7
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
        paddingHorizontal: 5
    }, 
    bottomCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFF',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 15,
        paddingBottom: 7,
    },
    fieldText: {
        fontFamily: 'roboto-regular',
        fontSize: 14,
        fontWeight: '100',
        paddingBottom: 8,
    },
    saveText: {
        fontFamily: 'roboto-medium', 
        fontSize: 13
    },
    deleteText:{
        color: '#E61616', 
        fontFamily: 'roboto-medium', 
        fontSize: 14
    }
});

export default EditMedicationScreen;