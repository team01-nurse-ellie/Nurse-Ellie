import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable'
import Background from '../components/background';
import ClipboardIcon from '../assets/images/clipboard-icon.svg';
import HP_Btn from '../assets/images/nurse-unselected-icon.svg';
import HP_BtnSelected from '../assets/images/nurse-selected-icon.svg';
import FamilyFriendBtn from '../assets/images/familyfriend-unselected-icon.svg';
import FamilyFriendBtnSelected from '../assets/images/familyfriend-selected-icon.svg';

const SymptomChecklistScreen = ({ navigation }) => {

    const [connectButtonHP, setConnectButtonHP] = useState({
        HPIcon: <HP_Btn style={styles.HPBtn} />,
        button: styles.connectButton,
        text: styles.connectButtonText,
    });

    const [connectButtonFamilyFriend, setConnectButtonFamilyFriend] = useState({
        FamilyFriendIcon: <FamilyFriendBtn style={styles.FamilyFriendBtn} />,
        button: styles.connectButton,
        text: styles.connectButtonText,
    });

    const buttonSelect = (type) => {

        if (type === 'hp') {
            setConnectButtonHP((state) => ({
                HPIcon: <HP_BtnSelected style={styles.HPBtn} />,
                button: styles.selectedConnectButton,
                text: styles.selectedConnectButtonText,
            }));
        } else if (type === 'ff') {
            setConnectButtonFamilyFriend((state) => ({
                FamilyFriendIcon: <FamilyFriendBtnSelected style={styles.FamilyFriendBtn} />,
                button: styles.selectedConnectButton,
                text: styles.selectedConnectButtonText,
            }));

        }
    };

    const buttonDeselect = () => {

    };

    return (
        <>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.screenHeader}>
                    <Text style={styles.headerFont}>
                        {`Symptom Checklist`}
                    </Text>
                    <ClipboardIcon height={50} style={styles.headerImage} />
                    
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

            </Animatable.View>
        </>
    );
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
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

export default SymptomChecklistScreen;