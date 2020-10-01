import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import QRCapture from '../../assets/images/qr-square.svg';

const QRScanner = () => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {

        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            (status == 'granted') ? setHasPermission(true) : setHasPermission(false);
            console.log(status)
        })();

    }, []);

    const handlQRCodeScanned = (scannerResult) => {
        console.log(scannerResult)
        // setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    const { width, height } = Dimensions.get('screen');
    const qrSize = width * 0.7;


    return (
        <>
            {!scanned &&
                <BarCodeScanner
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={scanned ? undefined : handlQRCodeScanned}
                    style={[StyleSheet.absoluteFillObject, {
                        flex: 1,
                        alignItems: 'center',
                        zIndex: 99
                        // ...StyleSheet.absoluteFillObject,
                        // width: Dimensions.get('screen').width
                        // height: 500,
                    }]}
                >
                    <Text style={{
                        color: 'white',
                        zIndex: 5,
                        fontSize: width * 0.09,
                        fontFamily: 'roboto-regular',
                        width: '70%',
                        textAlign: 'center',
                        marginTop: '10%',

                    }}>Scan QR Code
                    </Text>
                    <QRCapture style={{
                        marginTop: '20%',
                        marginBottom: '20%',
                        width: qrSize,
                        height: qrSize,
                    }} />


                </BarCodeScanner>
            }
        </>
    );

};

export default QRScanner;
