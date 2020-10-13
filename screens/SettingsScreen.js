import React, {useState, useEffect} from 'react';
import { View, Text, KeyboardAvoidingView, TouchableOpacity, Button, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon.svg';

const SettingsScreen = () => {
    return (
        <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
            <Background />
            <TouchableOpacity style={styles.button}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={styles.time}> </Text>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <Text style={styles.title}> Medication </Text>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

export default SettingsScreen;

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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