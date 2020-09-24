import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable'
import Background from '../components/background';
import NurseEllieConnectLogo from '../assets/android/drawable-hdpi/ellie-logo-connect.png';
import MenuDrawerBtn from '../assets/android/drawable-hdpi/patient-menu.png';
import HP_Btn from '../assets/android/drawable-hdpi/nurse-unselected-icon.png';
import HP_BtnSelected from '../assets/android/drawable-hdpi/nurse-selected-icon.png';
import FamilyFriendBtn from '../assets/android/drawable-hdpi/familyfriend-unselected-icon.png';
import FamilyFriendBtnSelected from '../assets/android/drawable-hdpi/familyfriend-selected-icon.png';


const UserLinkScreen = ({ navigation }) => {
    return (
        <>
            <Background />
            <Animatable.View style={styles.drawer} animation="fadeInUpBig">
                <View style={styles.screenHeader}>
                    <Text style={styles.headerFont}>
                        {`Stay\nConnected`}
                    </Text>
                    <Image style={styles.headerImage} source={NurseEllieConnectLogo} />
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
                    <Text style={{ fontSize: 20, color: 'grey' }}>
                        Connect to:
                    </Text>
                    <TouchableOpacity style={styles.connectButton}>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 20
                        }}>
                            <Image source={HP_Btn} style={{
                                height: 35,
                                resizeMode: 'contain',
                                marginRight: 30
                            }} />
                            <Text style={styles.connectButtonText}>
                                Health Professional
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.connectButton}>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 20,
                        }}>
                            <Image source={FamilyFriendBtn} style={{
                                height: 24,
                                resizeMode: 'contain',
                                marginRight: 30
                            }} />
                            <Text style={styles.connectButtonText}>
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
    connectButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 6,
        marginTop: 15,
        height: 70,
        justifyContent: 'center'
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
        height: 78,
        resizeMode: 'contain',
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