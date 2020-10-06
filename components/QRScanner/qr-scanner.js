import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import QRCapture from '../../assets/images/qr-square.svg';
import FlashOffIcon from '../../assets/images/flash-off.svg';
import FlashOnIcon from '../../assets/images/flash-on.svg';

const QRScanner = (navigation) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [flashOn, setFlash] = useState(false);

    useEffect(() => {

        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            (status == 'granted') ? setHasPermission(true) : setHasPermission(false);
            console.log(status)
        })();

    }, []);

    const handlQRCodeScanned = (scannerResult) => {
        console.log(scannerResult)
        alert(scannerResult.data)
        setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    const toggleFlash = () => {
        // console.log(!flashOn)
        setFlash(!flashOn);
    };

    const cancel = () => {
        navigation.goBack();
    };

    const { width, height } = Dimensions.get('screen');
    const qrSize = width * 0.7;
    const flashSize = width * 0.075;

    return (
        <>
            {/* !scanned && */}
            {
                <View style={{ flex: 1, zIndex: 100 }}>
                    <Camera
                        ratio="16:9"
                        flashMode={flashOn ? 'torch' : "off"}
                        barCodeScannerSettings={{
                            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
                        }}
                        onBarCodeScanned={scanned ? undefined : handlQRCodeScanned}
                        style={[StyleSheet.absoluteFillObject, {
                            // flex: 1,  
                            // alignItems: 'center',
                            zIndex: 99,
                            // ...StyleSheet.absoluteFillObject, 
                            // width: Dimensions.get('screen').width, 
                            // height: Dimensions.get('screen').height,
                        }]}>

                    </Camera>
                    <View style={{
                        // position: 'absolute',
                        alignItems: 'flex-end',
                        zIndex: 99
                        // backgroundColor: 'red'
                    }}>
                        {flashOn ?
                            <FlashOnIcon
                                onPress={toggleFlash}
                                width={flashSize}
                                style={styles.flashIcon}
                            /> :
                            <FlashOffIcon
                                onPress={toggleFlash}
                                width={flashSize}
                                style={styles.flashIcon}
                            />
                        }
                    </View>

                    <View style={{
                        alignItems: 'center'
                        ,
                        zIndex: 99
                    }}>
                        <Text style={{
                            color: 'white',
                            // zIndex: 5,
                            fontSize: width * 0.09,
                            fontFamily: 'roboto-regular',
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '5%',
                        }}>Scan Code
                </Text>
                        <QRCapture style={{
                            marginTop: '20%',
                            marginBottom: '20%',
                            width: qrSize,
                            height: qrSize,
                        }} />
                        <Text
                            onPress={cancel}
                            style={{
                                color: 'white',
                                // zIndex: 5,
                                fontSize: width * 0.09,
                                fontFamily: 'roboto-regular',
                                width: '100%',
                                textAlign: 'center',
                                marginTop: '10%',
                            }}>Cancel
                </Text>

                    </View>
                </View>
            }
        </>
    );

};

const styles = StyleSheet.create({
    flashIcon: {
        // position: 'absolute',
        marginTop: '2%',
        marginRight: 10,
    }
});

export default QRScanner;
