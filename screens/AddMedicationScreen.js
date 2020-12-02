import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  ScrollView
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Autocomplete from 'react-native-autocomplete-input';
import Modal from 'react-native-modal';
import moment from 'moment';
import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { calculateLocalTimezone } from '../utils/dateHelpers';
import { scheduleNotifications} from '../utils/scheduleNotifications';
import { alarmsRef } from '../utils/databaseRefs.js';

import PatientStyles from '../styles/PatientStyleSheet';
import Background from '../components/background';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import IconPicker from '../components/IconPicker';
import DayOfWeekPicker from '../components/DayOfWeekPicker';
import MenuIcon from '../assets/images/menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import PinkMedication from '../assets/images/pink-medication-icon.svg';
import SuccessIcon from '../assets/images/success-icon.svg';
import MedicationCard from '../components/MedicationCard';


import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import { UserContext } from '../components/UserProvider/UserContext';
import * as fsFn  from '../utils/firestore';
import { getAllByConcepts, getDrugsByIngredientBrand} from '../utils/medication';
import { ActivityIndicator } from 'react-native-paper';
// import { isCompositeComponent } from 'react-addons-test-utils';

const AddMedicationScreen = ({ navigation }) => {

  const autoCompleteRef = useRef();
  const { currentUser } = useContext(FirebaseAuthContext);
  const { firstName } = useContext(UserContext);
  const currentTime = new Date();
  const [medIcon, setMedIcon] = useState('1');
  const [scrollViewRef, setScrollViewRef] = useState();
  const [selectDoW, setSelectDoW] = useState([]);
  // is correct time in Seconds.
  // const [selectTime, setSelectTime] = useState(Date.now() / 1000);
  const [selectTime, setSelectTime] = useState(0);
  const [scheduledTime, setScheduledTime] = useState({
    hour: null,
    minute: null,
    AM_PM: null
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timestamp, setTimestamp] = useState({
    startDate: null,
    endDate: null
  });
  const [alarm, setAlarm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [drugFunction, setDrugFunction] = useState('');
  const [directions, setDirections] = useState('');
  const toggleSwitch = () => setAlarm(previousState => !previousState);
  const [loading, setLoading] = useState();
  const [masterRxcui, setMasterRxcui] = useState([]);
  const [filterRxcui, setFilterRxcui] = useState([]);
  const [drugList, setDrugList] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [medicationToAdd, setMedicationToAdd] = useState("Add Medication");
  const [medicationNotifications, setNotifications] = useState([]);

  useEffect(() => {
    // moment(endDate) < moment(startDate) || moment(endDate) < moment(currentTime)
    // console.log(firstName)
    let current = true;
    const unsubscribe = navigation.addListener('blur', () => {
      resetUserInput();
      // console.log("unmounting med screen");
    });
    
    load();

    return () => {
      (current = false)
      unsubscribe();
    };

  }, []);

  // load master list of molecules and brand-names
  async function load() {
    try {
      const ingredientsBrand = await getAllByConcepts(['IN', 'BN']);
      setMasterRxcui(ingredientsBrand);
      setMedicationToAdd('Add Medication');
    } catch (error) {
      console.log(error);
    }
  }

  // returns filtered sub-set of master rxnow query
  const filterByTerm = term => {
    if (term.length < 1) {
      return [];
    }
    var searchIngrBrand = term.trim();
    searchIngrBrand = searchIngrBrand.replace(/[() ]/g, '\\$0');
    const regex = new RegExp(searchIngrBrand, 'i');
    const filterList = masterRxcui[0]
      ? masterRxcui.filter(ingredientBrand => ingredientBrand.name.search(regex) >= 0)
      : [];
    return filterList;
  };

  // AutoComplete item based on user text input (by ingredients/brand name)
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={PatientStyles.autoListItem} 
      onPress={() => {renderDrugListModal(item.name); setSearchResult(item.name); setDrugList([]);}}>
      <Text style={PatientStyles.autoListFont} >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  // Shows modal and populates ListView of modal with MedicationCard
  const renderDrugListModal = async drug => {
    setLoading(true);
    // render drug modal
    setShowModal(true);
    const drugList = await getDrugsByIngredientBrand(drug);
    setDrugList(drugList);
    setLoading(false);
    if (drugList.length > 0) {
      setFilterRxcui([]);
    }
  };
  // Create header for AddMedication screen from a user selected medication
  const createMedicationHeader = () => {
    var header;
    if(medicationToAdd === Object(medicationToAdd)){
      header = medicationToAdd.nameDisplay;
      header += ' ' + medicationToAdd.strength;
      header += ' ' + medicationToAdd.doseForm;
    }
    return header;
  }
  
  // const scheduleNotifications = async (medicationToAdd) => {

  //   try {
  //     console.log(`***SCHEDULING ALARMS***`);
  //     let oneDay = 86400000;
  //     let daysToSchedule = [];
  //     let notifications = [];
      
  //     // console.log(`===== schedle ===== `);
  //     // console.log(scheduledTime)
  //     // console.log(timestamp)
  //     // console.log(selectDoW)
  //     // console.log(`===== schedle ===== `);
  //     // calculateLocalTimezone(year, month, day, scheduledTime.hour, scheduledTime.minute, scheduledTime.AM_PM);

  //     // 1 day - 86400000ms
  //     for (let i = timestamp.startDate;  i <= timestamp.endDate; i += oneDay) {
  //       // console.log(new Date(i));
  //       let date = new Date(i);
  //       // console.log(date.getDay());
  //       if (selectDoW.includes(date.getDay())) {
  //         daysToSchedule.push(i);
  //       }
  //       // console.log(date.getUTCDay());
  //     }

  //     // console.log(daysToSchedule);

  //     const content = {
  //       title: `${firstName}, it's time to take your ${medicationToAdd.nameDisplay}.`,
  //       body: `Please check-in if you have taken this medication.`,
  //     };

  //     // console.log(content);
      
  //     for (let i = 0; i < daysToSchedule.length; i++) {
  //       // console.log(daysToSchedule[i])
  //       await Notifications.scheduleNotificationAsync({ content, trigger: daysToSchedule[i] }).then(notificationID => {
  //         notifications.push({
  //           id: notificationID,
  //           trigger: daysToSchedule[i]
  //         });
  //       });
  //     }
  //     // console.log(notifications)
    
  //     const alarm = {
  //       content,
  //       notifications
  //     }
    
  //     return alarm;

  //   } catch (error) { throw error; }

  // };

  // Add medication with user settings to user collection
  const addMedicationToDB = async () => {
    // console.log(item.medication)
    //Check that there is start date, end date, day(s) of week, start dateand medication object
    if (medicationToAdd !== Object(medicationToAdd)) {
      Alert.alert('', '\nPlease find medication to add');
      return;
    } else if (startDate == undefined || endDate == undefined) {
      Alert.alert('', '\nPlease select a start and end date');
      return;
    } else if (selectDoW.length == 0) {
      Alert.alert('', '\nPlease select days of week medication will be taken');
      return;
    } else if (timestamp.endDate < timestamp.startDate) {
      Alert.alert('', '\nPlease select a valid end date');
      return;
    } else if (drugFunction == undefined || !drugFunction.trim().length > 0) {
      Alert.alert('', '\nPlease fill in function of the medication');
      return;
    } else if (directions == undefined || !directions.trim().length > 0) {
      Alert.alert('', '\nPlease fill in directions for intake');
      return;
    }

    var medSettings = {
      'medIcon': medIcon,
      'intakeTime': selectTime,
      'scheduledTime': scheduledTime,  
      'startDate': new Date(startDate),
      'startDateTimestamp': timestamp.startDate,
      'endDate': new Date(endDate),
      'endDateTimestamp': timestamp.endDate, 
      'daysOfWeek': selectDoW,
      'alarm': alarm,
      'function': drugFunction,
      'directions': directions,
      'alarmRef': null,
      // 'medicationNotifications': medicationNotifications,
    }

    // Merge medication information from APIs and user specified medication settings
    Object.assign(medicationToAdd, medSettings);
    // console.log(medicationToAdd);
    if (alarm == true) {

    //   scheduleNotifications(medicationToAdd,timestamp, selectDoW, firstName).then(async alarm => {
    //     const { content, notifications } = alarm;
    //     // console.log(alarm, `line 260`);
    //     await alarmsRef.doc(currentUser.uid).collection("medicationAlarms").add({
    //       alarmTitle: content.title,
    //       alarmBody: content.body,
    //       notifications: notifications
    //     }).then(async docRef => {
    //       medicationToAdd.alarmRef = docRef.id;
    //       // console.log(medicationToAdd, "---MED BEFORE ADDING---");
    //       // console.log(medicationToAdd);

    //     }).catch(error => { throw error; });
    //   });
    
          // Clear user input components if addition to DB successful 
          await fsFn.addMedication(currentUser.uid, medicationToAdd)
            .then(async (medicationDocID) => {
            // console.log(medicationDocID, `addMedication DATA RETURNED FROM FIRESTORE`);
            await scheduleNotifications(medicationToAdd, medicationDocID, timestamp, selectDoW, firstName).then(async alarm => {
              // once notifications scheduled, add details of notification object into user's medication's alarm object.
              const { content, notifications } = alarm;
              await alarmsRef.doc(currentUser.uid).collection("medicationAlarms").add({
                alarmTitle: content.title,
                alarmBody: content.body,
                notifications: notifications
              }).then(async docRef => {
                // once medication is added and scheduled notifications, use the alarm's ID and update the medication alarmRef property.
                medicationToAdd.alarmRef = docRef.id; 
                await fsFn.updateMedication(currentUser.uid, medicationDocID, medicationToAdd)
                  .then(async () => {
                    // Once done, navigate to medication list.
                    resetUserInput();
                    scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
                    Alert.alert('', '\nMedication Added!');
                    navigation.navigate('Medications');
                  }).catch(error => { throw error });
              }).catch(error => { throw error });
            }).catch(error => { throw error });
          }).catch(e => {
            e.toString() == 'Error: Medication already in user collection' ?
              (Alert.alert('', '\nYou have already added this medication'), resetUserInput()) :
              console.log(e);
          });

    } else {

      await fsFn.addMedication(currentUser.uid, medicationToAdd
        // Clear user input components if addition to DB successful 
      ).then(() => {
        resetUserInput();
        scrollViewRef.scrollTo({x:0,y:0,animated:true});
        Alert.alert('', '\nMedication Added!');
        navigation.navigate('Medications');
        setConfirmationModal(true);
      }
      ).catch(e => {
        e.toString() == 'Error: Medication already in user collection' ?
          (Alert.alert('', '\nYou have already added this medication'), resetUserInput()) :
          console.log(e);
      });
    }
    
  }
  
  // Reset user input components to default values
  const resetUserInput = () => {
    // Helps reset the autocomplete search input and renderedItems from a search term.
    setFilterRxcui([]);
    autoCompleteRef.current.textInput.clear();
    
    setMedIcon('1');
    setSelectTime(0);
    // setSelectTime(0) won't change the scheduledTime because selectTime is passed to TimePicker and used when AddMedicationScreen first rendered.
    // When leaving the screen and coming back here, the screen has already rendered and does not re-render.
    setScheduledTime({ hour: 12, minute: 0, AM_PM: "AM" });
    setTimestamp({ startDate: null, endDate: null });
    setStartDate();
    setEndDate();
    setSelectDoW([]);
    setAlarm(false);
    setMedicationToAdd('Add Medication');
    setDrugFunction();
    setDirections();
  }
  
  return (
    <KeyboardAvoidingView style={PatientStyles.background} behaviour="padding" enabled>
      <Background />
      <TouchableOpacity style={PatientStyles.menuButton} onPress={() => navigation.openDrawer()}>
        <MenuIcon />
      </TouchableOpacity>
      <Animatable.View style={PatientStyles.drawer} animation="fadeInUpBig">
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ paddingTop: 5, paddingRight: 10 }} onPress={() => navigation.goBack()}>
              <ReturnIcon />
            </TouchableOpacity>
            <Text 
              style={PatientStyles.title}>
                {medicationToAdd != "Add Medication" && medicationToAdd!='' ? 
                createMedicationHeader() : 
                "Add Medication"}
            </Text>
          </View>
        </View>
        <View style={PatientStyles.autoView}>
          <Autocomplete
            ref={autoCompleteRef}
            autoCapitalize="sentences"
            autoCorrect={false}
            containerStyle={PatientStyles.autoContainer}
            inputContainerStyle={PatientStyles.autoInputContainer}
            listContainerStyle={PatientStyles.autoListContainer}
            listStyle={PatientStyles.autoList}
            data={filterRxcui}
            defaultValue={searchResult}
            onChangeText={text => {setFilterRxcui(filterByTerm(text));}}
            //onShowResult={()=> setAutoResult('true')}
            placeholder="Find medication"
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <ScrollView ref={(ref)=>{setScrollViewRef(ref)}}>
        {filterRxcui.length != 0 ? (
          <>
            <View></View>
          </>
        ) : (
          <>
          <View style={{ alignItems: 'center', paddingTop:35, paddingBottom: 15 }}>
            <IconPicker selected={medIcon} onSelect={setMedIcon} />
            <TimePicker value={selectTime} onSelect={setSelectTime} setScheduledTime={setScheduledTime} />
          </View>
          <TextInput style={[PatientStyles.textInput, {marginVertical: 10}]} placeholder="Function" autoCapitalize="none"  onChangeText={(text) => setDrugFunction(text)}
                    value={drugFunction} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
          <TextInput style={[PatientStyles.textInput, {marginVertical: 10}]} placeholder="Directions for use" autoCapitalize="none"  onChangeText={(text) => setDirections(text)}
           value={directions} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
          <View style={{ paddingBottom: 14 }} />
          <View style={PatientStyles.card}>
            <View>
              <Text onPress={()=> console.log(scheduledTime)} style={PatientStyles.fieldText}> Start </Text>
              <Text onPress={()=> console.log(timestamp)} style={PatientStyles.fieldText}> Days </Text>
              <Text onPress={()=> console.log(selectDoW)} style={PatientStyles.fieldText}> End </Text> 
              <Text style={PatientStyles.fieldText}> Alarm </Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <View style={{ paddingBottom: 8 }}>
                      <DatePicker
                        selected={startDate}
                        onSelect={setStartDate}
                        dateTimestamp={(value) => setTimestamp(prev => ({ ...prev, startDate: value }))}
                        time={scheduledTime}
                        timestamp={timestamp}
                        placeholder="Start Date"
                      />
              </View>
                    <DayOfWeekPicker
                      selected={selectDoW}
                      onSelect={setSelectDoW}
                      startDate={timestamp.startDate}
                      endDate={timestamp.endDate}
                    />
              <View style={{ paddingBottom: 8 }}>
                      <DatePicker
                        selected={endDate}
                        onSelect={setEndDate}
                        dateTimestamp={(value) => setTimestamp(prev => ({ ...prev, endDate: value }))}
                        time={scheduledTime}
                        timestamp={timestamp}
                        placeholder="End Date"
                      />
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#42C86A' }}
                thumbColor={alarm ? '#F4F3F4' : '#F4F3F4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={alarm}
              />
            </View>
          </View>
          <View style={{ paddingBottom: 14 }} />
          <Button 
            title="ADD MEDICATION" 
            color="#42C86A" 
            onPress={addMedicationToDB} />
          <Modal
            isVisible={confirmationModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackButtonPress={()=> setConfirmationModal(false)}
            backdropOpacity={0}
            >
              <View style={styles.centeredView}>
                <View style={styles.confirmationModal}>
                  <SuccessIcon/>
                  <Text style={styles.confirmationFont}>Success!</Text> 
                  <Text styles={styles.confirmationFont}>You have added a new medication.</Text>
                  <View style={{paddingVertical: 2}}/>
                  <TouchableOpacity onPress={()=> setConfirmationModal(false)}>
                    <Text style={styles.confirmationTouchable}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </Modal>
          </> 
        )
        }
      </ScrollView>
      </Animatable.View>
      <Modal
        style={styles.modalDrawer}
        isVisible={showModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackButtonPress={() => setShowModal(false)}
        backdropOpacity={0}
        onModalWillShow={() => getDrugsByIngredientBrand()}
      >
      {loading ? (
        <>
          <ActivityIndicator/>
          <Text style={{alignSelf:'center'}}> Searching ...</Text>
        </>
        ) : (
        <>
          <View style={styles.modalHeader}>
            <Text style={PatientStyles.title}>{searchResult}</Text>
          </View>
          <FlatList
            style={{ margin: 0 }}
            data={drugList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={()=>{
                  setMedicationToAdd(item); 
                  setShowModal(false); 
                  setSearchResult('');}}>
                <MedicationCard>
                  <View style={{ justifyContent: 'center', flex: 2 }}>
                    <PinkMedication />
                  </View>
                  <View style={styles.medicationInfoView}>
                    <Text style={PatientStyles.medicationFont}>{item.nameDisplay}</Text>
                    <Text style={PatientStyles.doseFont}>{item.doseForm}</Text>
                  </View>
                  <View style={styles.strengthView}>
                    <Text style={styles.strengthFont}>{item.strength}</Text>
                  </View>
                </MedicationCard>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
        )
      }
      </Modal>
    </KeyboardAvoidingView>
  );
};

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    marginRight: 15,
  },
  strengthFont: {
    fontFamily: 'roboto-regular',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.85)',
  },
  medicationInfoView: {
    flex: 6,
    paddingHorizontal: 10,
  },
  strengthView: {
    flex: 2,
  },
  modalDrawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 30,
    margin: 0,
    position: 'absolute',
    width: screenWidth,
    height: screenHeight * 0.85,
    top: screenHeight * 0.15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  centeredView:{
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 22
  },
  confirmationModal: {
    backgroundColor: 'white', 
    borderRadius: 25, 
    padding: 35, 
    alignItems: "center", 
    elevation: 5
  }, 
  confirmationFont: {
    fontFamily: 'roboto-regular',
    fontSize: 24,
    color: 'rgba(0, 0, 0, 0.95)',
  },
  confirmationTouchable: {
    fontFamily: 'roboto-medium', 
    fontSize: 14, 
    color: '#42C86A'
  }

});

export default AddMedicationScreen;