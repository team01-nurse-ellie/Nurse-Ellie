import React, { useState, useEffect, useContext } from 'react';
import {View, Text, Button, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { VictoryBar, VictoryLabel, VictoryAxis, VictoryLine, VictoryChart } from "victory-native";

import Background from '../components/background';
import Card from '../components/MedicationCard';
import MenuIcon from '../assets/images/menu-icon.svg';
import EntryTriangle from '../assets/images/entry-triangle-icon.svg';

const MedicationSummary = ({ navigation }) => {

    const data = [
        { day: 'Sun', taken: 2, total: 2, label: "2"}, 
        { day: 'Mon', taken: 3, total: 3, label: "3"}, 
        { day: 'Tue', taken: 1, total: 2, label: "1"}, 
        { day: 'Wed', taken: 3, total: 3, label: "3"},
        { day: 'Thr', taken: 3, total: 4, label: "3"}, 
        { day: 'Fri', taken: 1, total: 2, label: "1"}, 
        { day: 'Sat', taken: 3, total: 2, label: "3"},
    ] 

    state = {
        modalVisible:false,
    };

    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background/>
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Medication Summary
                    </Text>
                </View>
                <VictoryChart
                    height={230}
                    width={350}>
                <VictoryBar 
                    barRatio={0.92}
                    cornerRadius={{ topLeft:10, topRight:10, bottomLeft:10, bottomRight:10 }}
                    data={data} x="day" y="taken" 
                    style={{data:{fill:'#42C86A'}}}
                    labelComponent = { <VictoryLabel/> }
                    height={230}
                    width={300}
                />
                <VictoryLine 
                    data={data} x="day" y="total"/>
                <VictoryAxis/>
                </VictoryChart>
                <Card>
                    <View>
                        <Text style={styles.cardTitle}> Medication Intake </Text>
                        <Text style={styles.descriptionFont}> Yesterday: Completed </Text>
                        <Text style={styles.descriptionFont}> Today: 3 Medications left</Text>
                        <Text style={styles.descriptionFont}> Tomorrow: 4 Medications </Text>
                        <View style={{padding: 5}}/>
                        <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', paddingHorizontal: 5}}>
                            <Text style={styles.clickableFont}>DETAILS</Text><EntryTriangle style={{paddingHorizontal:7}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.status}>Excellent</Text>
                    </View>
                </Card>
                <View style={{paddingVertical: 4}} />
                <Card>
                    <View>
                        <Text style={styles.cardTitle}> Blood Glucose Level </Text>
                        <Text style={styles.descriptionFont}> Last Recorded: </Text>
                        <Text style={styles.descriptionFont}> Monday, July 27 at 2:00PM </Text>
                        <View style={{padding: 5}}/>
                        <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', paddingHorizontal: 5}}>
                            <Text style={styles.clickableFont}>DETAILS</Text><EntryTriangle style={{paddingHorizontal:7}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.measurement}>140mg/dl</Text>
                    </View>
                </Card>
                <View style={{paddingVertical: 4}} />
                <Button
                    title="Share Results"
                    color='#42C86A'
                    />
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
    menuButton: {
        position: 'absolute',
        right: 30,
        top: 40 
    },
    header:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 10
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    }, 
    descriptionFont:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.7)'
    },
    clickableFont:{
        fontFamily: 'roboto-medium',
        fontSize: 15,
        fontWeight: "100",
    },
    status: {
        fontFamily: 'roboto-regular',
        fontSize: 18, 
        color: '#42C86A'
    }, 
    measurement: {
        fontFamily: 'roboto-regular',
        fontSize: 17
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