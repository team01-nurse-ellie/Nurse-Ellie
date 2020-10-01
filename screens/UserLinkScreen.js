import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable'
import Background from '../components/background';
import NurseEllieConnectLogo from '../assets/images/ellie-connect-logo.svg';
import HP_Btn from '../assets/images/nurse-unselected-icon.svg';
import HP_BtnSelected from '../assets/images/nurse-selected-icon.svg';
import FamilyFriendBtn from '../assets/images/familyfriend-unselected-icon.svg';
import FamilyFriendBtnSelected from '../assets/images/familyfriend-selected-icon.svg';
import Modal from 'react-native-modal';
import CloseBtn from '../assets/images/close-button.svg';
import QRScanner from '../components/QRScanner/qr-scanner';

const UserLinkScreen = ({ navigation }) => {

    const unselectedHP = {
        HPIcon: <HP_Btn style={styles.HPBtn} />,
        button: styles.connectButton,
        text: styles.connectButtonText,
    }

    const selectedHP = {
        HPIcon: <HP_BtnSelected style={styles.HPBtn} />,
        button: styles.selectedConnectButton,
        text: styles.selectedConnectButtonText,
    }

    const unselectedFF = {
        FamilyFriendIcon: <FamilyFriendBtn style={styles.FamilyFriendBtn} />,
        button: styles.connectButton,
        text: styles.connectButtonText,
    }

    const selectedFF = {
        FamilyFriendIcon: <FamilyFriendBtnSelected style={styles.FamilyFriendBtn} />,
        button: styles.selectedConnectButton,
        text: styles.selectedConnectButtonText,
    }

    const methodsModal = (
        <View>
            <View style={{ marginBottom: 15 }}>
                {/* select meth txxt */}
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular' }}>Select Method:</Text>
            </View>
            <View>
                {/* buttons */}
                <TouchableOpacity style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Provide Code
                </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Scan QR Code
                </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Input Code
                </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const inputCodeModal = (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular', }}>
                    Enter Connect Code:
                </Text>
            </View>
            <View>
                <TextInput></TextInput>
                <TouchableOpacity onPress={() => { }} style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Submit
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const QRModal = (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular', }}>
                    Scan Code
                </Text>
                <QRScanner />
            </View>
        </View>
    );

    const [connectButtonHP, setConnectButtonHP] = useState(unselectedHP);

    const [connectButtonFamilyFriend, setConnectButtonFamilyFriend] = useState(unselectedFF);

    const buttonSelect = (type) => {

        if (type === 'hp') {
            setConnectButtonHP((state) => (selectedHP));
        } else if (type === 'ff') {
            setConnectButtonFamilyFriend((state) => (selectedFF));
        }

        openModal();
    };

    const [isModalVisible, setModalVisible] = useState(false);

    const buttonDeselect = () => {
        setConnectButtonHP(unselectedHP);
        setConnectButtonFamilyFriend(unselectedFF);
    };

    const closeModal = () => {
        buttonDeselect();
        setModalVisible(false);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    return (
        <>
            <KeyboardAvoidingView style={styles.background} behavior="padding" enabled>
                <Background />
                <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                    <View style={styles.screenHeader}>
                        <Text style={styles.headerFont}>
                            {`Stay\nConnected`}
                        </Text>
                        <NurseEllieConnectLogo height={75} style={styles.headerImage} />
                        {/* <Image style={styles.headerImage} source={NurseEllieConnectLogo} /> */}
                    </View>
                    <View style={styles.UserLinkScreenDescription}>
                        <Text style={styles.descriptionText}>
                            {`Connecting to a `}
                            <Text style={styles.underline}>
                                {`Health Professional`}
                            </Text>
                            {` will allow them to view your medication logs. And, will allow you to book appointments, report any symptoms, and connect with them.`}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.connectText}>
                            Connect to:
                    </Text>
                        <TouchableOpacity onPressIn={() => buttonSelect('hp')} style={connectButtonHP.button}>
                            <View style={styles.buttonFormat}>
                                {connectButtonHP.HPIcon}
                                <Text style={connectButtonHP.text}>
                                    Health Professional
                            </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={() => buttonSelect('ff')} style={connectButtonFamilyFriend.button}>
                            <View style={styles.buttonFormat}>
                                {connectButtonFamilyFriend.FamilyFriendIcon}
                                <Text style={connectButtonFamilyFriend.text}>
                                    Family Member / Friend
                            </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        // needs to be set to 0, otherwise it flickers when modal is closing.
                        backdropTransitionOutTiming={0}
                        isVisible={isModalVisible}
                        onBackButtonPress={closeModal}
                        onBackdropPress={closeModal}
                    >
                        <View style={{ backgroundColor: 'white', padding: 25, paddingBottom: 55, borderRadius: 25 }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                {/* exit btn */}
                                <TouchableOpacity onPressIn={() => { closeModal() }} pressRetentionOffset={{ bottom: 70, right: 70 }}>
                                    <CloseBtn />
                                </TouchableOpacity>
                            </View>
                            {/* Modal content */}
                            {QRModal}
                        </View>
                    </Modal>
                </Animatable.View>
            </KeyboardAvoidingView>
        </>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    methodBtn: {
        backgroundColor: '#42C86A',
        elevation: 3,
        borderRadius: 5,
        marginTop: 15,
    },
    methodBtnText: {
        fontFamily: 'roboto-medium',
        fontWeight: '900',
        fontSize: 17,
        alignSelf: 'center',
        color: 'white',
        textTransform: 'uppercase',
        margin: 10,
        letterSpacing: 2
    },
    buttonFormat: {
        flexDirection: 'row',
        marginLeft: 35
    },
    connectText: {
        fontSize: 20,
        color: 'grey'
    },
    HPBtn: {
        height: 35,
        resizeMode: 'contain',
        marginRight: 30
    },
    FamilyFriendBtn: {
        height: 24,
        resizeMode: 'contain',
        marginRight: 30
    },
    selectedConnectButton: {
        backgroundColor: '#42C86A',
        borderRadius: 20,
        elevation: 6,
        marginTop: 15,
        height: 70,
        justifyContent: 'center'
    },
    connectButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 6,
        marginTop: 15,
        height: 70,
        justifyContent: 'center'
    },
    selectedConnectButtonText: {
        color: 'white',
        fontFamily: 'roboto-medium',
        fontSize: 17,
        alignSelf: 'center',
        marginLeft: 0
    },
    connectButtonText: {
        color: 'grey',
        fontFamily: 'roboto-medium',
        fontSize: 17,
        alignSelf: 'center',
        marginLeft: 0
    },
    background: {
        flex: 1,
        backgroundColor: '#42C86A',
    },
    UserLinkScreenDescription: {
        marginBottom: 85,

    },
    descriptionText: {
        fontFamily: 'roboto-medium',
        fontSize: 17,
        lineHeight: 23,
        color: 'grey'
    },
    underline: {
        textDecorationLine: 'underline'
    },
    screenHeader: {
        flexDirection: 'row',

    },
    whitePadding: {
        height: screenHeight / 8
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    heading: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'absolute',
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100",
    },
    headerImage: {
        flex: 1,
        right: 10,
        // height: 100,
        // resizeMode: 'contain',
    },
    UserLinkScreenDescriptionFont: {
        fontFamily: 'roboto-regular',
        fontSize: 12
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
    },
    button: {
        paddingRight: 30,
        marginTop: 30
    },
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
    }
});

export default UserLinkScreen;