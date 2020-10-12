import React, {useState, useEffect} from 'react';
import { View, Text, Button, TextInput, Switch, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';

import * as Animatable from 'react-native-animatable';
import ScrollPicker from 'react-native-wheel-scroll-picker';

import Background from '../components/background';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import SearchIcon from '../assets/images/search-icon';

import PinkMedication from '../assets/images/pink-medication-icon';

const AddMedicationScreen = ({ navigation }) => {
    const currentTime = new Date();
    const [selectTime, setSelectTime] = useState(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [alarm, setAlarm] = useState('false');
    const toggleSwitch = () => setAlarm(previousState => !previousState);

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={{paddingTop: 5, paddingRight: 10}}onPress={()=> navigation.goBack()}>
                        <ReturnIcon/>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        Add Medication
                    </Text>
                    </View>
                    <MedicationsIcon/>
                </View>
                <View style={styles.searchInput}>
                    <TextInput style={{minWidth: screenWidth*0.8}}placeholder="Search Medication..."></TextInput>
                    <TouchableOpacity onPress={()=>Alert.alert('searching medication...')}>
                        <SearchIcon/>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', paddingTop: 10}}>
                    <PinkMedication/>
                </View>
                <View style={{alignItems: 'center', paddingVertical: 15}}>
                    <TimePicker
                        value={selectTime}
                        onSelect={setSelectTime}
                    />
                </View>
                <View style={styles.bottomCard}>
                    <View>
                        <Text style={styles.fieldText}> Reminder Times </Text>
                        <Text style={styles.fieldText}> Dosage </Text>
                    </View>
                </View>
                <View style={{paddingBottom: 14}}/>
                <View style={styles.bottomCard}>
                    <View>
                        <Text style={styles.fieldText}> Start </Text>
                        <Text style={styles.fieldText}> Days </Text>
                        <Text style={styles.fieldText}> Duration </Text>
                        <Text style={styles.fieldText}> Alarm </Text>
                    </View>
                    <View style={{justifyContent:'flex-end'}}>
                        <View style={{paddingBottom: 8}}>
                            <DatePicker
                                selected={startDate}
                                onSelect={setStartDate}
                                placeholder="Start Date"/>
                        </View>
                        <Text style={styles.fieldText}> M, W, F </Text>
                        <View style={{paddingBottom: 8}}>
                            <DatePicker 
                                selected={endDate}
                                onSelect={setEndDate}
                                placeholder="End Date" />
                        </View>
                        <Switch 
                            trackColor={{ false: "#767577", true: "#42C86A" }}
                            thumbColor={alarm ? "#F4F3F4" : "#F4F3F4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={alarm}
                        />
                    </View>
                </View>
                <View style={{paddingBottom: 14}}/>
                <Button title="ADD MEDICATION" color='#42C86A' onPress={()=>Alert.alert("medication added")}/>
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
    header:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 20
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    },
    searchInput:{
        flexDirection: 'row',
        borderBottomColor: 'rgba(0, 0, 0, 0.4)',
        borderBottomWidth: 1, 
        minWidth: screenWidth * 0.80, 
        marginVertical:10
    },
    fieldText:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        fontWeight: '100', 
        paddingBottom: 8
    },
    bottomCard: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        borderRadius: 10, 
        elevation: 3, 
        backgroundColor: '#FFF', 
        shadowOffset: { width: 1, height: 1}, 
        shadowColor: '#333', 
        shadowOpacity: 0.3, 
        shadowRadius: 2, 
        marginHorizontal: 4, 
        marginVertical: 6, 
        paddingHorizontal: 15, 
        paddingVertical: 15, 
        paddingTop: 15, 
        paddingBottom: 7
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
});

export default AddMedicationScreen;