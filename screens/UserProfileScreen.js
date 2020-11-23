import React, { useState }from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Dimensions, StyleSheet, Keyboard, StatusBar, Alert, KeyboardAvoidingView, Animated} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon';
import EntryIcon from '/Users/hoangvu/Nurse-Ellie/assets/images/g-entry-arrow-icon.svg';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from '../components/DatePicker';
import 'firebase/storage';


const UserProfileScreen = ({navigation}) => {
    //state declare
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const usersRef = firebase.firestore().collection('users')
    const [gender, setGender] = useState('none')
    const [bdate, setDate] = useState(new Date(1598051730000));

  

    //update user profile to firebase
   const onEditUser = async (res) => {
   const data = await firebase.auth().currentUser.uid
   
    var userDoc = usersRef.doc(data).update({
        'fullName':'',
        'email': '',
        'gender': '',
        'bdate': '',
    })

    const obj = {
        fullName,
        email,
        gender,
        bdate
        };
    usersRef.doc(data).update(obj)
    navigation.navigate('HomeScreen')

    }

    // alert
    const simpleAlertHandler = () => {
        alert('Your user profile is up to date');
    };

    // date function
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
    };

    const showDatePicker = () => {
        setDateVisi(true);
      };
    
    const hideDatePicker = () => {
        setDateVisi(false);
      };
    
    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setDate(date);

        hideDatePicker();
    };

    //gender function
    const placeholder = {
        label: 'Select your gender...',
        value: null,
        color: '#9EA0A4',
      };

      // image function
    
    
return (
      
    <View style={styles.container}>
        <Background/>
    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <MenuIcon />
    </TouchableOpacity>
    <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight / 10 }}>
        <NurseEllieLogo height={75} style={{ flex: 1, marginRight: '5%' }} />
        <Text style={{ fontFamily: 'roboto-regular', fontSize: 25, paddingRight: 30}}> {`Edit User Profile`}</Text>
    </View>
    

    <TextInput style={styles.textInput} placeholder="Full Name" autoCapitalize="none"  onChangeText={(text) => setFullName(text)}
                    value={fullName} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>

     <TextInput style={styles.textInput} typep="email" placeholder="New email" autoCapitalize="none"  onChangeText={(text) => setEmail(text)}
                    value={email} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>                
    
    <View style={{
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                <Text style={{
                            fontSize: 16,
                            color: "black",
                            alignContent: "flex-start",
                            paddingLeft: 0
                }}>Date of Birth:</Text>
                <DatePicker selected={bdate} onSelect={setDate} placeholder="Select Date" />
        </View>
        
        <View style={{
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                <Text style={{
                            fontSize: 16,
                            color: "black",
                            alignContent: "flex-start",
                            paddingLeft: 0
                }}>Gender:</Text>
                <View style={{paddingRight: 150}}>
                <RNPickerSelect placeholder={placeholder}
                onValueChange={gender => setGender(gender)}
                styles={{paddingLeft: 1000}}
                items={[
                { label: 'Men', value: 'men' },
                { label: 'Women', value: 'women' },
                { label: 'Others', value: 'other' },
            ]}/>
                </View>
               
        </View>
     
        <TouchableOpacity style={styles.button} onPress={() => { onEditUser(); simpleAlertHandler(); }}>  
            <EntryIcon />
        </TouchableOpacity>
                    
      <View style={styles.whitePadding}/>
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
        fontSize: 28,
        fontWeight: "100", 
    },
    whitePadding: {
        height: screenHeight / 8
    },
    textInput: {
        borderBottomColor: 'rgba(112, 112, 112, 0.7)',
        borderBottomWidth: 1.5,
        fontSize: 16,
        paddingTop: 8
    },
    descriptionFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.7)'
    },
    clickableFont: {
        fontFamily: 'roboto-medium',
        fontSize: 14,
    },
    button: {
        marginTop: 30,
        alignSelf: 'flex-start'
    },
    menuButton: {
        position: 'absolute',
        right: 30,
        top: 40
    },
    calendar: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30, 
      },
      calendarIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      date: {
        fontSize: 2,
        marginTop: 9,
        top: 10
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
