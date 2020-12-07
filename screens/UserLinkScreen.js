import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable'

import Background from '../components/background';

import NurseEllieConnectLogo from '../assets/images/ellie-connect-logo.svg';
import NurseEllieLogo from '../assets/android/drawable-hdpi/entry-logo.png';
import HP_Btn from '../assets/images/nurse-unselected-icon.svg';
import HP_BtnSelected from '../assets/images/nurse-selected-icon.svg';
import FamilyFriendBtn from '../assets/images/familyfriend-unselected-icon.svg';
import FamilyFriendBtnSelected from '../assets/images/familyfriend-selected-icon.svg';
import CloseBtn from '../assets/images/close-button.svg';

import PatientStyles from '../styles/PatientStyleSheet';

import Modal from 'react-native-modal';

import QRCode from 'react-native-qrcode-svg';
import { firebase } from "../components/Firebase/config";
import { generateCode } from '../utils/codeGenerator';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import MenuIcon from '../assets/images/menu-icon.svg';

const UserLinkScreen = ({ navigation }) => {

    const [userCode, setUserCode] = useState("");
    const [currentUserData, setUserData] = useState(null); 
    const { currentUser } = useContext(FirebaseAuthContext);
    const [connectType, setConnectType] = useState("");
    const [modalContentRender, setContentRender] = useState({
        showMethodsModal: true,
        showProvideCode: false,
        showInputCode: false
    });
    const [submitDisable, setSubmitDisable] = useState(false);

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

        if (type === 'HEALTH_PRO') {
            setConnectButtonHP((state) => (selectedHP));
        } else if (type === 'FRIEND_FAMILY') {
            setConnectButtonFamilyFriend((state) => (selectedFF));
        }

        setConnectType(type);
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
            setContentRender(state => ({
                ...state,
                showMethodsModal: true
            }))
            setModalContent(methodsModal)
        } else if (type === "PROVIDE") {
            setModalContent(provideCodeModal);
            setContentRender(state => ({
                ...state,
                showMethodsModal: false,
                showProvideCode: true
            }))
        } else if (type === "INPUT") {
            setContentRender(state => ({
                ...state,
                showMethodsModal: false,  
                showProvideCode: false
            }))
            setModalContent(inputCodeModal);
        }
    };

    const useQR = () => {
        console.log("go to qr screen")
        closeModal();
        setTimeout(t => {
            navigation.navigate('QRScreen', { connecting: {
                connectUser: connectUser,
                connectMethod: "QR", 
                connectType: connectType
            }});
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

    const connectUser = async (connectMethod, connectType, data = null) => {
  
        let isFF = false;

        if (connectType == "FRIEND_FAMILY") {
            isFF = true;
        }

        await firebase.firestore().collection("users").where("connectCode", "==", (data) ? data : inputCode).get().then(async querySnapshot => {
            // results for user to be connected to
            let foundUser = false;
            let userID = null;  
            let user = null;
            
            querySnapshot.forEach(i => {
                foundUser = true;
                user = i.data();
                userID = i.id;   
            });

            if (foundUser === true) {

                let matches = [];

                await firebase.firestore().collection("users").doc(currentUser.uid).get().then(async doc => {
                   
                    if (doc.data()) {  
                        setUserData(doc.data());  
                        matches = doc.data().userLinks.filter(ref => user.userLinks.includes(ref));
                        // console.log(doc.data().userLinks, `user1`)
                        // console.log(user.userLinks, "user2")
                        // console.log(matches, `matches`);
                    }

                    if (matches.length > 0) {
                        alert("Already connected!");   
                    } else {
                        await firebase.firestore().collection("userlinks").add({
                            connectionType: connectType,
                            connectionMethod: connectMethod,
                            isFriendFamily: isFF,
                            user1: currentUser.uid,
                            user2: userID
                        }).then(async docRef => {   
                            let currentUserRefSet = false;
                            let secondUserRefSet = false;

                            // Setting current user ref
                            await firebase.firestore().collection("users").doc(currentUser.uid).update({
                                userLinks: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                            }).then(() => {
                                currentUserRefSet = true;
                                console.log("Setted current user, userlinks array")
                            }).catch(error => {
                                console.log(error)
                            });

                            // Setting 2nd user ref
                            await firebase.firestore().collection("users").doc(userID).update({
                                userLinks: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                            }).then(() => {
                                secondUserRefSet = true;
                                console.log("Setted second user, userlinks array")
                            }).catch(err => {
                                console.log(error)
                            });
                            
                            if (currentUserRefSet && secondUserRefSet) {
                                alert("Connected successfully!");
                            } else {
                                alert("Couldn't set references for either user!")
                            }

                        }).catch(error => {
                            alert("Failed to connect with user!");
                        });
                    }
                    // enables submit button
                    setSubmitDisable(false);
                });

            } else {
                alert("User not found!")
                // enables submit button
                setSubmitDisable(false);
            }

        }).catch((error) => {
            console.log(error);
        })

        // return "done";
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
                    style={[PatientStyles.textInput, {paddingTop: 8}]}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss} 
                    onChange={(event) => {
                        setInputCode(event.nativeEvent.text.trim());
                        // console.log(event.nativeEvent.text)
                    }}
                // value={inputCode}          
                >
                </TextInput>
                <TouchableOpacity disabled={submitDisable} onPress={() => {
                    // Disables button to prevent POSTing data more than once.
                    setSubmitDisable(true);
                    setTimeout(t=> {
                        connectUser("INPUT", connectType);
                    }, 250);
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
                <TouchableOpacity style={PatientStyles.menuButton} onPress={() => navigation.openDrawer()}>
                    <MenuIcon />
                </TouchableOpacity>
                <Animatable.View style={[PatientStyles.drawer, {justifyContent: 'space-between'}]} animation="fadeInUpBig">
                    <View style={styles.screenHeader}>
                        <Text style={PatientStyles.headerFont}>
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
                        <TouchableOpacity onPressIn={() => buttonSelect('HEALTH_PRO')} style={connectButtonHP.button}>
                            <View style={styles.buttonFormat}>
                                {connectButtonHP.HPIcon}
                                <Text style={connectButtonHP.text}>
                                    Health Professional
                            </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={() => buttonSelect('FRIEND_FAMILY')} style={connectButtonFamilyFriend.button}>
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
                        // onBackButtonPress={closeModal} 
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
                            {/* Can't render using states for each JSX element, need to do this way to perserve state updates. */}
                            {modalContentRender.showMethodsModal ? methodsModal : 
                                !modalContentRender.showProvideCode ? inputCodeModal : provideCodeModal}
                        </View>
                    </Modal>
                </Animatable.View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
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
    headerImage: {
        flex: 1,
        right: 10,
    },
    UserLinkScreenDescriptionFont: {
        fontFamily: 'roboto-regular',
        fontSize: 12
    },
});

export default UserLinkScreen;