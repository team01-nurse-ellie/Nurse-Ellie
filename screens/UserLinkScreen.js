import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable'
import Background from '../components/background';
import NurseEllieConnectLogo from '../assets/images/ellie-connect-logo.svg';
import NurseEllieLogo from '../assets/android/drawable-hdpi/entry-logo.png';
import HP_Btn from '../assets/images/nurse-unselected-icon.svg';
import HP_BtnSelected from '../assets/images/nurse-selected-icon.svg';
import FamilyFriendBtn from '../assets/images/familyfriend-unselected-icon.svg';
import FamilyFriendBtnSelected from '../assets/images/familyfriend-selected-icon.svg';
import Modal from 'react-native-modal';
import CloseBtn from '../assets/images/close-button.svg';
import QRCode from 'react-native-qrcode-svg';
import { firebase } from "../components/Firebase/config";
import { generateCode } from '../utils/codeGenerator';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import MenuIcon from '../assets/images/menu-icon.svg';

const UserLinkScreen = ({ navigation }) => {

    const [userCode, setUserCode] = useState("");
    const { currentUser } = useContext(FirebaseAuthContext);

    useEffect(() => {

        if (currentUser) {

            firebase.firestore().collection("users").where("id", "==", currentUser.uid).get().then((querySnapshot) => {

                querySnapshot.forEach(e => {
                    // console.log(e.data());
                    setUserCode(e.data().connectCode);
                });

                // console.log(querySnapshot[0].data());
            });
        }

    }, []);


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

    // const [methodsShown, setMethodsShown] = useState(false);

    const buttonDeselect = () => {
        setConnectButtonHP(unselectedHP);
        setConnectButtonFamilyFriend(unselectedFF);
    };

    const closeModal = () => {
        buttonDeselect();
        setModalVisible(false);
        // setMethodsShown(false);
    };

    const openModal = () => {
        handleModalContent("METHODS");
        setModalVisible(true);
        // setMethodsShown(true);
    };

    const handleModalContent = (type) => {
        console.log("handled")
        if (type === "METHODS") {
            // modalContent = methodsModal;
            setModalContent(methodsModal)
        } else if (type === "PROVIDE") {
            setModalContent(provideCodeModal);
        } else if (type === "INPUT") {
            setModalContent(inputCodeModal);
        }
    };

    const useQR = () => {
        console.log("go to qr screen")
        closeModal();
        setTimeout(t => {
            navigation.navigate('QRScreen');
        });
    };

    const promptRefreshCode = () => {

        // console.log(NurseEllieLogo);
        Alert.alert("Refresh Code", "Are you sure?", [
            {
                text: 'Cancel',
            },
            {
                text: 'OK',
                onPress: () => refreshCode()
            },
        ], { cancelable: true });
        // alert("Are you sure you?");

    }

    const refreshCode = () => {
        let code = generateCode();
        firebase.firestore().collection("users").doc(currentUser.uid).update({
            connectCode: code
        }).then(() => {
            setUserCode(code);
            closeModal();
        });

    };

    const modalGoBack = () => {
        console.log("modalGoBack()")

        if (methodsPressed) {
            handleModalContent("METHODS");
            setMethodsPressed(false);
            // setMethodsShown(false);  
        } else {
            closeModal();
            console.log(methodsPressed);
        }
    };

    const [methodsPressed, setMethodsPressed] = useState(false);

    const [inputCode, setInputCode] = useState("");

    const methodsModal = (
        <View>
            <View style={{ marginBottom: 15 }}>
                {/* select meth txxt */}
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular' }}>Select Method:</Text>
            </View>
            <View>
                {/* buttons */}
                <TouchableOpacity onPress={() => {
                    setMethodsPressed(true);
                    handleModalContent("PROVIDE");
                }
                } style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Provide Code
                </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={useQR} style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Scan QR Code
                </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setMethodsPressed(true);
                    handleModalContent("INPUT")
                }} style={styles.methodBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Input Code
                </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const provideCodeModal = (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular', marginBottom: "5%" }}>
                    Connect Code
                </Text>
                <QRCode
                    logo={NurseEllieLogo}
                    logoSize={65}
                    logoBackgroundColor='transparent'
                    size={250}
                    value={userCode}
                />
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular', marginTop: "5%" }}>
                    {userCode}
                </Text>
                <TouchableOpacity onPress={promptRefreshCode} style={styles.refreshCodeBtn}>
                    <View style={{}}>
                        <Text style={styles.methodBtnText}>
                            Refresh
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const inputCodeModal = (
        <View>
            <View style={{ alignItems: 'center', marginBottom: '10%' }}>
                <Text style={{ fontSize: 25, fontFamily: 'roboto-regular' }}>
                    Enter Connect Code:
                </Text>
            </View>
            <View>
                <TextInput
                    textAlign="center"
                    autoFocus={true}
                    autoCapitalize="characters"
                    style={styles.textInput}
                    returnKeyType="done"
                    // onSubmitEditing={Keyboard.dismiss} 
                    onChangeText={(code) => setInputCode(code)}
                // value={inputCode}          
                >
                </TextInput>
                <TouchableOpacity onPress={() => {
                    console.log(typeof (inputCode));
                    alert("Connect to user");
                    Keyboard.dismiss();
                }} style={[styles.methodBtn, { marginTop: "10%" }]}>
                    <View>
                        <Text style={styles.methodBtnText}>
                            Submit
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const [modalContent, setModalContent] = useState(methodsModal);

    return (
        <>
            <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" enabled>
                <Background />
                <TouchableOpacity style={styles.button} onPress={() => navigation.openDrawer()}>
                    <MenuIcon />
                </TouchableOpacity>
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
                        {/* <TextInput style={{ backgroundColor: 'pink' }}></TextInput> */}
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
                        onBackButtonPress={modalGoBack}
                    >
                        <View style={{ backgroundColor: 'white', padding: 25, paddingBottom: 55, borderRadius: 25 }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                {/* exit btn */}
                                <TouchableOpacity onPressIn={() => { closeModal() }} pressRetentionOffset={{ bottom: 70, right: 70 }}>
                                    <CloseBtn />
                                </TouchableOpacity>
                            </View>
                            {/* Modal content */}
                            {modalContent}
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
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)',
        borderBottomWidth: 1.5,
        fontSize: 16,
        paddingTop: 8,
        // backgroundColor: 'cyan'
    },
    refreshCodeBtn: {
        backgroundColor: '#42C86A',
        elevation: 3,
        borderRadius: 5,
        marginTop: 15,
        width: "90%"
    },
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
    // whitePadding: {
    //     height: screenHeight / 8
    // },
    // textInput: {
    //     borderBottomColor: 'black',
    //     borderBottomWidth: 1
    // },
    // heading: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //     position: 'absolute',
    //     paddingHorizontal: 20,
    //     paddingBottom: 5
    // },
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
    // clickableFont: {
    //     fontFamily: 'roboto-medium',
    //     fontSize: 14,
    // },
    button: {
        position: 'absolute',
        right: 30,
        top: 40
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
        // bottom: 0,
        top: screenHeight * 0.15,   
        justifyContent: 'space-between'
    }
});

export default UserLinkScreen;