import React from 'react';
import { View, Text, Button, Dimensions, StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
    return (
        <View style={styles.background}>
        <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
        </Animatable.View>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#42C86A'
    }, 
    drawer: {
        flex: 3,
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 50, 
        paddingHorizontal: 30
    }
})