import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';

const hpBackground = () => {
    return (
        <View style={styles.container}>
            <View style={styles.circleBlue} />
            <View style={styles.circle}/>
            <View style={styles.circleMedium}/>
            <View style={styles.circleXLLarge}/>
            <View style={styles.circleLarge} />
        </View>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        backgroundColor: '#4285C8',
    }, 
    circle: {
        height: 60, 
        width: 60, 
        borderRadius: 60/2, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        position: 'absolute',
        left: 10, 
        top: 30
    }, 
    circleMedium: {
        height: 250,
        width: 250,
        borderRadius: 250/2, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        position: 'absolute',  
        left: screenWidth/5,
        top: screenHeight/6
    }, 
    circleLarge:{
        height: 350, 
        width: 350,
        borderRadius: 350/2, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        position: 'absolute',
        left: -screenWidth/3, 
        top: screenHeight/2
    }, 
    circleXLLarge: {
        height: 600, 
        width: 600, 
        borderRadius: 300, 
        backgroundColor:'rgba(255, 255, 255, 0.3)', 
        position: 'absolute',
        left: screenWidth/2.5,
        top: -screenHeight/4
    }, 
    circleBlue: {
        height: 500, 
        width: 500, 
        borderRadius: 500/2, 
        backgroundColor: 'rgba(51, 112, 172, 0.8)', 
        position: 'absolute',
        right: -screenWidth/2,
        top: screenHeight/2
    }
});

export default hpBackground;