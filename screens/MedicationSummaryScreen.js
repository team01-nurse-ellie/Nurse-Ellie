import React, { useState, useEffect, useContext } from 'react';
import {View, Text, Button, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn from '../utils/firestore';
import * as Animatable from 'react-native-animatable';
import { VictoryBar, VictoryLabel, VictoryAxis, VictoryLine, VictoryChart } from "victory-native";

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import Card from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import EntryTriangle from '../assets/images/entry-triangle-icon.svg';

const MedicationSummary = ({ navigation, route }) => {

    const { currentUser } = useContext(FirebaseAuthContext);
    const [intakeStats, setIntakeStats] = useState();
    const [last7DayStats, setlast7DayStats] = useState();

    useEffect(()=> {
        // async function wrapper 
        
        (async () => {


            await fsFn.getWeekIntakeStats(currentUser.uid).then((intakeStats) => {
                setlast7DayStats(intakeStats.last7DaysStats);
                setIntakeStats(intakeStats);
            });

        })();

    }, []);
    
    return (
        <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={PatientStyles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig"> 
                <View style={PatientStyles.header}>
                    <Text style={PatientStyles.title}>
                        Medication Summary
                    </Text>
                </View>
                {last7DayStats && <VictoryChart         
                    height={230}
                    width={350}>
                <VictoryBar 
                    barRatio={0.92}
                    cornerRadius={{ topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 }}
                    data={last7DayStats} x="day" y="taken"
                    style={{ data: { fill: '#42C86A' } }}
                    labelComponent={<VictoryLabel />}
                    height={230}
                    width={300}
                />
                <VictoryLine 
                    data={last7DayStats} x="day" y="total"/>
                <VictoryAxis/>
                </VictoryChart>}

                <Card>
                    <View>
                        <Text style={styles.cardTitle}> Medication Intake </Text>
                        <Text style={styles.descriptionFont}> Yesterday: {intakeStats && intakeStats.yesterdayStatus} </Text>
                        {/* <Text style={styles.descriptionFont}> Yesterday: {intakeStats.yesterdayStatus} </Text> */}
                        <Text style={styles.descriptionFont}> Today: {intakeStats && intakeStats.todayStatus}</Text>
                        {/* <Text style={styles.descriptionFont}> Today: {intakeStats.todayStatus}</Text> */}
                        <Text style={styles.descriptionFont}> Tomorrow: {intakeStats &&  intakeStats.tomorrowStatus} </Text>
                         {/* <Text style={styles.descriptionFont}> Tomorrow: 4 Medications </Text> */}
                        <View style={{padding: 5}}/>
                       {/*  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                            <Text style={PatientStyles.clickableFont}>DETAILS</Text><EntryTriangle style={{ paddingHorizontal: 7 }} />
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.timeView}>
                        <Text style={[styles.status, { color: (intakeStats && intakeStats.generalStatus === "Excellent") ? '#42C86A' : 'orange' }]}>
                            {intakeStats && intakeStats.generalStatus}
                        </Text>
                    </View>
                </Card>
               {/*  <View style={{paddingVertical: 4}} /> */}
              {/*   <Card>
                    <View>
                        <Text style={styles.cardTitle}> Blood Glucose Level </Text>
                        <Text style={styles.descriptionFont}> Last Recorded: </Text>
                        <Text style={styles.descriptionFont}> Monday, July 27 at 2:00PM </Text>
                        <View style={{padding: 5}}/>
                        <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', paddingHorizontal: 5}}>
                            <Text style={PatientStyles.clickableFont}>DETAILS</Text><EntryTriangle style={{paddingHorizontal:7}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.measurement}>140mg/dl</Text>
                    </View>
                </Card> */}
              {/*   <View style={{paddingVertical: 4}} /> */}
                {/* <Button
                    title="Share Results"
                    color='#42C86A'
                    /> */}
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    descriptionFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    status: {
        fontFamily: 'roboto-regular',
        fontSize: 16, 
    }, 
    measurement: {
        fontFamily: 'roboto-regular',
        fontSize: 17
    },
    timeView:{
        borderLeftColor: 'rgba(0, 0, 0, 0.33)', 
        borderLeftWidth: 1,
        paddingHorizontal: 15, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: 100
    },
    cardTitle: {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 1)'
    }
});

export default MedicationSummary;