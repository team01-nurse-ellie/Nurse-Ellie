import React, { useState, useEffect }from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Button, Dimensions, StyleSheet, Keyboard, Picker, Alert, KeyboardAvoidingView, Icon} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import Background from '../components/background.js';
import MenuIcon from '../assets/images/menu-icon.svg';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from '../components/ImagePicker';

const EditUserProfileScreen = ({navigation}) => {
    //state declare
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const usersRef = firebase.firestore().collection('users')
    const [gender, setGender] = useState('none')
   // const [bdate, setDate] = useState('2020-11-24T05:00:00.000Z');
    const [dateVisi, setDateVisi] = useState(false);
    const [date, setDate] = useState('');
    const [image, setImage] = useState('1');

    //update user profile to firebase
   const onEditUser = async (res) => {
   const data = await firebase.auth().currentUser.uid
   
    var userDoc = usersRef.doc(data).update({
        'fullName':'',
        'email': '',
        'gender': '',
        'date': '',
        'image': ''
    })

    const obj = {
        fullName,
        email,
        gender,
        date,
        image
    };
    usersRef.doc(data).update(obj)
    navigation.navigate('UserProfile')

    }
  const cancel = () => {
        navigation.navigate('UserProfile')
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
  
  // display
      const [user, setUser] = useState();
  
      const getUser = async () => {
          const {uid} = firebase.auth().currentUser;
  
        try {
          const documentSnapshot = await usersRef
            .doc(uid)
            .get();
    
          const userData = documentSnapshot.data();
          console.log(userData);
          setUser(userData);
        } catch(error) {
          alert(error);
        }
      };
    
  // Get user on mount
      useEffect(() => {
          
        getUser();
      }, []);

      const placeholder = {
        label: 'Select your gender ...',
        value: null,
        color: '#9EA0A4',
      };

    // check input 
      const checkTextInput = () => {
        //Check for the Name TextInput
        if (!fullName.trim()) {
          alert('Please Enter Name');
          return;
        }
        //Check for the Email TextInput
        if (!email.trim()) {
          alert('Please Enter Email');
          return;
        }
        if (!gender.trim()) {
            alert('Please Select Gender');
            return;
          }
      
         
        //Checked Successfully
        //Do whatever you want
        alert('Success');
      };

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
  
    <Text>Full Name: </Text>
    <TextInput style={styles.textInput} placeholder={user && user?.fullName} autoCapitalize="none"  onChangeText={(text) => setFullName(text)}
                    value={fullName} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
    <Text>New email: </Text>
     <TextInput style={styles.textInput} typep="email" placeholder={user && user?.email} autoCapitalize="none"  onChangeText={(text) => setEmail(text)}
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
                }}>Gender:  {user && user?.gender}  </Text>
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
                <TouchableOpacity style={styles.button} onPress={() => { showDatePicker();}}>  
                <View style={styles.inner} style={{paddingRight: 150, top: -12}} >
                  <Text style={styles.TextComponentStyle}>{user && user.date && user.date.seconds && new Date(user.date.seconds * 1000).toLocaleDateString("en-US")}</Text>
                </View>
                <DateTimePickerModal mode="date"
                    isVisible={dateVisi}
                    value={date}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    onChange={onChange}
                    maximumDate={new Date()}
                
                />
                 
                </TouchableOpacity>
        </View>


        <View style={styles.container}>
      <View style={styles.button}>
      <Button 
            title="Save"
            onPress={() => { onEditUser(); checkTextInput(); }}
             color="#606070" 
          />
      </View>
      <View style={styles.button}> 
      <Button 
            title="Cancel"
            onPress={cancel}
            color="#606070" 
          /></View>
    </View>
      
      <View style={styles.whitePadding}/>
            </Animatable.View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: 'green',
        width: '40%',
        height: 40
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
    },
    TextComponentStyle: {
 
      borderRadius: 5,
   
      // Set border width.
      borderWidth: 2,
   
      // Set border Hex Color Code Here.
      borderColor: 'black',
   
      // Setting up Text Font Color.
      color: 'black',
   
      // Setting Up Background Color of Text component.
      backgroundColor : 'white',
      
      // Adding padding on Text component.
      padding : 7,
      fontSize: 14,
   
      textAlign: 'center',
   
      margin: 10
    }

});

export default EditUserProfileScreen;
