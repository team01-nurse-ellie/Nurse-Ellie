import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import Background from '../components/background';
import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import DissatisfiedIcon from '../assets/images/scale-dissatisfied-icon.svg';


const SymptomChecklistScreen = ({ navigation }) => {



    return (
        <>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.screenHeader}>
                    <Text style={styles.headerFont}>
                        {`Symptom Checklist`}
                    </Text>
                    <ClipboardIcon style={styles.headerImage} />
                    
                </View>

                <View>
                    <Text style={styles.simpleText}>
                        { `How are you feeling?` }
                    </Text>

                    <View>

                        <ClipboardIcon/>
                        <DissatisfiedIcon/>


                    </View>

                    <Text style={styles.simpleText}>
                        { `   Terrible                      Better` }
                    </Text>
                </View>

                <View>
                    <Text style={styles.simpleText}>
                        {`Are you feeling any pain or discomfort?`}
                    </Text>
                </View>

                <View>
                    <Text style={styles.simpleText}>
                        {`Where are you experiencing the pain or discomfort?`}
                    </Text>
                </View>

                <View>
                    <Text style={styles.simpleText}>
                        {`How would you describe the pain or discomfort you are experiencing?`}
                    </Text>
                </View>
                
                <View>
                    <Text style={styles.simpleText}>
                        {`Additional details you would like your health professional know.  More details can help your health professional give you better care or treatment.`}
                    </Text>
                </View>

                <View>
                    <Text>Create SUBMIT button </Text>
                </View>

            </Animatable.View>
        </>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({

    drawer: {
        flex: 4,
        // backgroundColor: 'gray',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        bottom: 0,
        justifyContent: 'space-between'
    },

    headerImage: {
        flex: 1,
        left: 30,
        width:null,
        height: null,
        resizeMode: 'contain'
    },

    simpleText: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
        lineHeight: 23,
        color: 'grey'
    },

    underline: {
        textDecorationLine: 'underline'
    },
    screenHeader: {
        flexDirection: 'row',

    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100",
    }

    ///////////////////
 
    

});

export default SymptomChecklistScreen;