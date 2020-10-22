import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import QRScanner from '../components/QRScanner/qr-scanner';
import * as Animatable from 'react-native-animatable'; 

const QRScreen = ({ navigation, route, ...props }) => {

    // const [showQR, setShowQR] = useState(true);
    const { params } = route; 
    useEffect(() => {
          
        // setTimeout(t => {
        //     setShowQR(true);
        // }, 1000);
        // adds a slight delay to allow camera to load up without delaying initial screen load up when navigating to QR screen.
    }, []);

    return (
        <>
            {/* <View style={{ flex: 1, backgroundColor: 'black', zIndex: -99 }}> */}
            <QRScanner {...navigation} {...params.connecting} />
            {/*  </View> */}

        </>
    )
}



export default QRScreen;   