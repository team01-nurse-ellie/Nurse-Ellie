import React, {useState, useEffect, useContext} from 'react';
import {
    TextInput, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Icon,
    View, Button, Platform, TouchableOpacity, StyleSheet, Dimensions, Easing, Text
} from 'react-native';
import Modal from 'react-native-modalbox';
import DateTimePicker from '@react-native-community/datetimepicker';
// import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-community/picker';
import ImagePicker from '../components/ImagePicker';
import moment from 'moment';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import { firebase } from '../components/Firebase/config';
import { usersRef } from '../utils/databaseRefs';
import * as Animatable from 'react-native-animatable';

import Background from '../components/background.js';
import MenuIcon from '../assets/images/menu-icon.svg';
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import { backgroundColor } from 'react-native-calendars/src/style';


var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const CALENDAR_THEME = {
  textSectionTitleColor: '#707070', 
  selectedDayBackgroundColor: '#42C86A',
  selectedDayTextColor: '#FFFFFF',
  todayTextColor: '#42C86A', 
  dayTextColor: '#707070', 
  arrowColor: '#707070', 
  monthTextColor: '#707070', 
  textDayFontFamily: 'roboto-regular',
  textDayFontSize: 12,
  textDayHeaderFontFamily: 'roboto-regular',
  textDayHeaderFontSize: 12,
  textMonthFontFamily: 'roboto-regular',
  textMonthFontSize: 12,
};

export default EditUserProfileScreen = ({ navigation }) => {
    //   const [mode, setMode] = useState('date');
    /* const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    }; */
    /* const showTimepicker = () => {
       showMode('time');
    }; */

    // setMode(currentMode);
    // showMode('date');
    
    // setMode(currentMode);
    // showMode('date');

    const [date, setDate] = useState();
    const [show, setShow] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isGenderModalOpen, setGenderModalOpen] = useState(false);


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [genderData, setGenderData] = useState([
        { label: 'Men', value: 'Men' },
        { label: 'Women', value: 'Women' },
        { label: 'Other', value: 'Other' },
    ]);
    const [image, setImage] = useState();
    const [user, setUser] = useState(null);
    const [genderPlaceholder, setGenderPlaceholder] = useState({
        label: 'Select your gender ...',
        value: null,
        color: '#9EA0A4',
    });
    
    // const [dateVisi, setDateVisi] = useState(false); ?????????

    const { currentUser } = useContext(FirebaseAuthContext);

    useEffect(() => {
        
        console.log(Platform.OS);
        getUser();

        // fullName,
        // email,
            // gender,
        // date,
        // image
        
        return () => {
            console.log("un-mount USER EDIT PROFILE");
        }
    }, []);

    const checkTextInput = () => {
        console.log(`checkText`); 
        // IF CHECKS FAIL, DO NOT SAVE USER
        
        //Check for the Name TextInput
        if (!fullName.trim()) {
            alert('Please Enter Name');
            return false;
        }
        //Check for the Email TextInput
        if (!email.trim()) {
            alert('Please Enter Email');
            return false;
        }
        if (!gender.trim()) {
            alert('Please Select Gender');
            return false;
        }

        //Checked Successfully
        //Do whatever you want
        // IF CHECKS PASS, SAVE USER
        alert('Success');
        return true;

    };

    const getUser = async () => {

        try {
            
            const documentSnapshot = await usersRef.doc(currentUser.uid).get();
            const userData = documentSnapshot.data();
            
            console.log(new Date(userData.date.seconds * 1000));
            setUser(userData);
            setFullName(userData.fullName);
            setEmail(userData.email);
            setGender(userData.gender);
            // setDate(userData.date.seconds);
            setDate(new Date(userData.date.seconds * 1000));
            setImage(userData.image)
            

        } catch (error) { throw error; }

    };

    const onEditUser = async () => {
        
        const obj = {
            fullName,
            email,
            gender,
            date,
            image
        };

        // console.log(obj)

        usersRef.doc(currentUser.uid).update(obj).then(() => {

            navigation.navigate('UserProfile');
        });
     
        // const data = await firebase.auth().currentUser.uid;

        /* let userDoc = usersRef.doc(currentUser.uid).update({
            'fullName': '',
            'email': '',
            'gender': '',
            'date': '',
            'image': ''
        }); */

    }

    const onCancel = () => { navigation.navigate('UserProfile'); }

    const onChange = (event, selectedDate) => {
        
        console.log(`Date Changed!`, selectedDate);
        if (selectedDate === undefined) {
            // Whenever android user clicks away, or clicks on cancel. Set current date.
            // selectedDate = new Date();
            selectedDate = date;
        }

        const birthDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(birthDate);
    };

    const showDatePicker = () => { setShow(true); };
    const hideDatePicker = () => { setShow(false); };
    const onModalClose = () => { setModalOpen(false); hideDatePicker(); }
    const onModalOpen = () => { showDatePicker(); setModalOpen(true); }

    const onGenderModalOpen = () => { setGenderModalOpen(true); }
    const onGenderModalClose = () => { setGenderModalOpen(false); }

  return (
      <View style={styles.container}>
          <Background />
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
              <MenuIcon />
          </TouchableOpacity>
          <Animatable.View style={styles.drawer} animation="fadeInUpBig">
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight / 10 }}>
                  <NurseEllieLogo height={75} style={{ flex: 1, marginRight: '5%' }} />
                  <Text style={{ fontFamily: 'roboto-regular', fontSize: 25, paddingRight: 30 }}> {`Edit User Profile`}</Text>
              </View>

              <View style={{ alignSelf: 'flex-end', marginRight: '10%',  }}>
              {
                image &&
                <ImagePicker selected={image} onSelect={setImage} />
              }
              </View>


              <Text>Full Name: </Text>
              <TextInput
                  style={styles.textInput}
                  placeholder={user && user.fullName}
                  autoCapitalize="words"
                  onChangeText={(text) => setFullName(text)}
                  value={fullName}
                  returnKeyType='done'
                  onSubmitEditing={Keyboard.dismiss} />

              <Text>New email: </Text>
              <TextInput style={styles.textInput}
                  typep="email"
                  placeholder={user && user.email}
                  autoCapitalize="none"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  returnKeyType='done'
                  onSubmitEditing={Keyboard.dismiss} />        

              <View style={{
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 10
              }}>
                  <Text style={{
                      fontSize: 16,
                      color: "black",
                      alignContent: "flex-start",
                      paddingLeft: 0
                  }}>Gender:   </Text>

                  {(Platform.OS == 'ios') && <Text onPress={onGenderModalOpen} style={[styles.TextComponentStyle, {}]}>{gender}  </Text>}
                  
                  {(Platform.OS == 'android')  && (
                      <View style={{ marginRight: '30%' }}>

                          <Picker
                              accessibilityLabel={`GenderPicker`}
                              selectedValue={gender}
                              mode={`dropdown`}
                              style={{ height: 50, width: 150 }}
                              onValueChange={(selectedGender) => setGender(selectedGender)}>
                              {/* Render the gender data  */}
                              {genderData.map(gender => {
                                  return (
                                      <Picker.Item key={gender.value} label={gender.label} value={gender.value} />
                                  );
                              })}
                          </Picker>

                      </View>
                  )}
                  
              </View>

              <View style={{
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  flexDirection: "row",
                //   justifyContent: "space-between",
                  alignItems: "center",
              }}>
                  <Text style={{
                      fontSize: 16,
                      color: "black",
                      alignContent: "flex-start",
                      paddingLeft: 0
                  }}>
                      Date of Birth:
                    </Text>

                  <TouchableOpacity style={styles.button} onPress={() => { onModalOpen(); }}>
                      {/* <Text style={styles.TextComponentStyle}>{user && user.date && user.date.seconds && new Date(user.date.seconds * 1000).toLocaleDateString("en-US")}</Text>  */}
                      <View style={styles.inner} style={{ paddingRight: 0, top: 0, }} >
                          <Text style={styles.TextComponentStyle}>{date && moment(date).format('MMMM Do, YYYY')}</Text>
                      </View>
                  </TouchableOpacity>
              </View>

              <View style={styles.container}>
                  <View style={styles.button}>
                      <Button
                          title="Save"
                          onPress={() => { 
                              (checkTextInput() === true) && onEditUser();
                          }}
                          color="#606070"
                      />
                  </View>
                  <View style={styles.button}> 
                      <Button 
                          title="Cancel"
                          onPress={onCancel}
                          color="#606070"
                      /></View>
              </View>

       {/*        <View style={styles.whitePadding} /> */}



          

      {/* <View>
        <Button onPress={onModalOpen} title="show DOB" />
      </View> */}
      
      {(Platform.OS == 'android') && show && (
        <DateTimePicker
            accessibilityLabel={'dateAndroidPicker'}
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}




        {(Platform.OS == 'ios') && <Modal
              animationDuration={300}
              backButtonClose
              backdropOpacity={0.7}
              swipeToClose={false} 
              coverScreen
              easing={Easing.out(Easing.ease)}
              backdropPressToClose={true}
             
              isOpen={isGenderModalOpen}
              onClosed={onGenderModalClose}
              style={styles.backdrop}
        >
            <View style={styles.modal}>
            
                      <Picker
                          accessibilityLabel={`GenderPicker`}
                          //string value 
                          selectedValue={gender}
                          mode={`dropdown`}
                          style={{ height: 220, width: 250, alignSelf: 'center' }}
                          onValueChange={(selectedGender) => {
                              setGender(selectedGender);
                               console.log(selectedGender)
                      }}>
                          {/* Render the gender data  */}
                          {genderData.map(gender => {
                              return (
                                  <Picker.Item key={gender.value} label={gender.label} value={gender.value} />
                              );
                          })}
                      </Picker>

                      <View style={styles.actions}>
                      {/* <TouchableOpacity onPress={this.onCancel} style={styles.button}> */}
                      {/* CANCEL BUTTON */}
                          {/* <TouchableOpacity onPress={onModalClose} style={styles.button}>
                              <Text style={styles.modalAction}>Cancel</Text>
                          </TouchableOpacity> */}
                             
                          {/* SELECT BUTTON */}
                          <TouchableOpacity
                              // disabled={!isString(marked)}
                              // onPress={this.onSelect}
                              onPress={() => { onGenderModalClose(); }}
                              // style={[styles.button, styles.select, marked ? styles.primary : styles.disabled]}
                              style={[styles.button, styles.select, styles.primary]}
                          >
                              {/*  <Text style={marked ? styles.modalPrimaryAction : styles.modalAction}>Select</Text> */}
                              <Text style={styles.modalPrimaryAction}>Close</Text>
                          </TouchableOpacity>

                      </View>
                      {/*      <RNPickerSelect
                fixAndroidTouchableBug={true}
                placeholder={genderPlaceholder}
                onValueChange={(selectedGender) => setGender(selectedGender)}
                styles={{ paddingLeft: 1000, backgroundColor: 'green' }}
                items={genderData} 
                /> */}

            </View>
        </Modal>}

          {(Platform.OS == 'ios') && show &&

              <Modal
                  animationDuration={300}
                  backButtonClose
                  backdropOpacity={0.7}
                  swipeToClose={false}
                  coverScreen
                  easing={Easing.out(Easing.ease)}


                  isOpen={isModalOpen}
                  onClosed={onModalClose}
                  style={styles.backdrop}
              >
                  <View style={styles.modal}>

                      {/*   <DOBCalendar
                        current={new Date()}
                        style={styles.calendar}
                        theme={CALENDAR_THEME}
                        maxDate={new Date()}
                    // markedDates={this.getMarkedDates()}
                    // onDayPress={this.onDayPress}
                    /> */}
                      
                    {/* RNDateTimePicker */}
                      <DateTimePicker
                      accessibilityLabel={`dateIOSPicker`}
                          testID="dateTimePicker"
                          value={date}
                          mode={'date'}
                          is24Hour={true}
                          display="default"
                          onChange={onChange}
                          maximumDate={new Date()}
                      />

                      <View style={styles.actions}>
                      {/* <TouchableOpacity onPress={this.onCancel} style={styles.button}> */}
                      {/* CANCEL BUTTON */}
                          {/* <TouchableOpacity onPress={onModalClose} style={styles.button}>
                              <Text style={styles.modalAction}>Cancel</Text>
                          </TouchableOpacity> */}
                             
                          {/* SELECT BUTTON */}
                          <TouchableOpacity
                              // disabled={!isString(marked)}
                              // onPress={this.onSelect}
                              onPress={() => { onModalClose(); }}
                              // style={[styles.button, styles.select, marked ? styles.primary : styles.disabled]}
                              style={[styles.button, styles.select, styles.primary]}
                          >
                              {/*  <Text style={marked ? styles.modalPrimaryAction : styles.modalAction}>Select</Text> */}
                              <Text style={styles.modalPrimaryAction}>Close</Text>
                          </TouchableOpacity>

                      </View>

                  </View>
              </Modal>}
         
              </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
    // button: {
    //   marginTop: 30,
    //   alignSelf: 'flex-start'
    // },
    // calendar: {
    //     position: 'relative',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     width: 30,
    //     height: 30, 
    //   },
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    button: {
      backgroundColor: 'green',
      width: '40%',
      height: 40,
    //   marginRight: '5%'
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
    menuButton: {
      position: 'absolute',
      right: 30,
      top: 40
    },
    calendar: {
      alignSelf: 'stretch',
      paddingBottom: 15,
    },
    modal: {
      alignSelf: 'stretch',
      backgroundColor: 'white',
      borderRadius: 5,
      paddingHorizontal: 0,
      paddingVertical: 15,
    },
    backdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      justifyContent: 'center',
      padding: 20,
    },
    modalAction: {
      color: '#707070',
      fontFamily: 'roboto-regular',
      fontSize: 12,
    },
    modalPrimaryAction: {
      color: '#FFFFFF',
      fontFamily: 'roboto-regular',
      fontSize: 12,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    select: {
      marginLeft: 15,
      marginRight: '5%',
    },
    primary: {
      backgroundColor: '#42C86A',
    },
    disabled: {
      backgroundColor: 'rgba(112, 112, 112, 0.4)',
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
    button: {
      alignSelf: 'flex-start',
      borderRadius: 30,
      paddingHorizontal: 15,
      paddingVertical: 12,
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
      backgroundColor: 'white',
      // Adding padding on Text component.
      padding: 7,
      fontSize: 14,
      textAlign: 'center',
      margin: 10
    }
  });