import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import QRScanner from '../components/QRScanner/qr-scanner';
import * as Animatable from 'react-native-animatable';

const QRScreen = () => {

    return (
        <>
            <Animatable.View
                delay={10}
                style={{ flex: 4 }}
                animation="fadeInUpBig">
                <QRScanner style={{}} />
            </Animatable.View>

        </>
    )
}



export default QRScreen;   