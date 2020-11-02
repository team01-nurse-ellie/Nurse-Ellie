import React, { useState }from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard, Picker, Alert} from 'react-native';
import DatePicker from 'react-native-datepicker'
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const UserProfileScreen = ({navigation}) => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDob] = useState('')
    const usersRef = firebase.firestore().collection('users')
    const [gender, setGender] = useState('none')

    
   const onEditUser = async (res) => {
   const data = await firebase.auth().currentUser.uid
    var userDoc = usersRef.doc(data).update({
        'fullName':'',
        'email': '',
        'gender': '',
        'date': ''
    })

    const obj = {
        fullName,
        email,
        gender,
        date
    };
    usersRef.doc(data).update(obj)
    navigation.navigate('HomeScreen')

    }

    const simpleAlertHandler = () => {
        alert('Your user profile is up to date');
    };

    let handleOnChange = ( email ) => {

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        if ( re.test(email) ) {
            
        }
        else {
            console.log("INVALID EMAIL");
        }
    
    }

return (
        <View style={styles.container}>
            <Background/>
           
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
                <Image style={styles.headerImage} source={require('../assets/android/drawable-mdpi/login-logo.png')} />
                <Text style={styles.headerFont}>Edit User Profile</Text>
                <View style={styles.whitePadding}/>
               
                <TextInput style={styles.textInput} placeholder="Full Name" autoCapitalize="none"  onChangeText={(text) => setFullName(text)}
                    value={fullName} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>

                <TextInput style={styles.textInput} typep="email" placeholder="New email" autoCapitalize="none"  onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss} onChange={ handleOnChange }/>

                <DatePicker
                        style={styles.datePickerStyle}
                        date={date} // Initial date from state
                        mode="date" // The enum of date, datetime and time
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate="01-01-2016"
                        maxDate="01-01-2019"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            },
                            dateInput: {
                            marginLeft: 36,
                            },
                        }}
                        onDateChange={(date) => {
                            setDob(date);
                        }}
                        />

                <Text style={styles.textInput}>Gender</Text>
                 <Picker
                        gender={gender}
                        style={{ height: 150, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                    >
                        <Picker.Item label="Men" value="men" />
                        <Picker.Item label="Women" value="women" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                
                <TouchableOpacity style={styles.button} onPress={() => { onEditUser(); simpleAlertHandler(); }}>  
                    <Image source={require('../assets/android/drawable-mdpi/g-login-arrow.png')} />
                </TouchableOpacity>
                <View style={styles.whitePadding}/>
                <Text style={styles.descriptionFont}></Text>
               
            </Animatable.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
    }, 
    heading: {
        flex: 1, 
        justifyContent: 'flex-end', 
        paddingHorizontal: 20, 
        paddingBottom: 5
    },
    headerFont: {
        fontFamily: 'roboto-regular',
        fontSize: 32,
        fontWeight: "100", 
        left: screenWidth/3.5, 
        top: screenHeight * 0.07,
        paddingBottom: 30
    },
    headerImage: {
        position: 'absolute', 
        left: screenWidth/20, 
        top: screenHeight * 0.07
    },
    whitePadding: {
        height: screenHeight/8
    },
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)', 
        borderBottomWidth: 1.5,
        fontSize: 16, 
        paddingTop: 8
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 12, 
        color: 'rgba(0, 0, 0, 0.38)'
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
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 50, 
        paddingHorizontal: 30, 
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.15
    }
});

export default UserProfileScreen;
