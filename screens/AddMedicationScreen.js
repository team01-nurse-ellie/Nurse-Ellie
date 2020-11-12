import React, { useState, useEffect, useContext } from 'react';
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

import Background from '../components/background';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import IconPicker from '../components/IconPicker';
import DayOfWeekPicker from '../components/DayOfWeekPicker';
import MenuIcon from '../assets/images/menu-icon.svg';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import PinkMedication from '../assets/images/pink-medication-icon';
import MedicationCard from '../components/MedicationCard';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import * as fsFn  from '../utils/firestore';
import { getAllByConcepts, getDrugsByIngredientBrand} from '../utils/medication';
import { ActivityIndicator } from 'react-native-paper';

const AddMedicationScreen = ({ navigation }) => {
  const { currentUser } = useContext(FirebaseAuthContext);
  const currentTime = new Date();
  const [medIcon, setMedIcon] = useState('1');
  const [scrollViewRef, setScrollViewRef] = useState();
  const [selectDoW, setSelectDoW] = useState([]);
  // const [selectTime, setSelectTime] = useState(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60);
  const [selectTime, setSelectTime] = useState('12:00 AM');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [alarm, setAlarm] = useState('false');
  const [showModal, setShowModal] = useState(false);
  const [drugFunction, setDrugFunction] = useState();
  const [directions, setDirections] = useState();
  const toggleSwitch = () => setAlarm(previousState => !previousState);
  const [loading, setLoading] = useState();
  const [masterRxcui, setMasterRxcui] = useState([]);
  const [filterRxcui, setFilterRxcui] = useState([]);
  const [drugList, setDrugList] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [medicationToAdd, setMedicationToAdd] = useState("Add Medication");


  useEffect(() => {
    load();
  }, []);

  // load master list of molecules and brand-names
  async function load() {
    try {
      //const ingredientsBrand = await getAllByConcepts(['IN','BN','MIN']);
      const ingredientsBrand = await getAllByConcepts(['IN', 'BN']);
      await setMasterRxcui(ingredientsBrand);
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
      style={styles.acListItem} 
      onPress={() => {renderDrugListModal(item.name); setSearchResult(item.name); setDrugList([]);}}>
      <Text style={styles.acListFont} >
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
  
  // Add medication with user settings to user collection
  const addMedicationToDB = async () => {
    // Check that there is start date, end date, day(s) of week, start dateand medication object
    if (startDate == undefined || endDate == undefined) {
      Alert.alert('', '\nPlease select a start and end date');
      return;
    } else if (selectDoW.length == 0) {
      Alert.alert('', '\nPlease select days of week medication will be taken');
      return;
    } else if (medicationToAdd !== Object(medicationToAdd)) {
      Alert.alert('', '\nPlease find medication to add');
      return;
    } else if(moment(endDate) < moment(startDate) || moment(endDate) < moment(currentTime)){
      Alert.alert('', '\nPlease select a valid end date');
      return;
    } else if(!drugFunction.length > 0 || !directions.length > 0) {
      Alert.alert('', '\nPlease fill in function and direcion');
      return;
    }
    var medSettings = {
      'medIcon': medIcon,
      'intakeTime' : selectTime,
      'startDate' : startDate,
      'endDate' : endDate,
      'daysOfWeek' : selectDoW,
      'alarm': alarm,
      'function': drugFunction,
      'directions': directions,
    }
    // Merge medication information from APIs and user specified medication settings
    Object.assign(medicationToAdd, medSettings);
    await fsFn.addMedication(currentUser.uid, medicationToAdd
      // Clear user input components if addition to DB successful
      ).then(() => {
        resetUserInput();
        scrollViewRef.scrollTo({x:0,y:0,animated:true});
        Alert.alert('','\nMedication Added!');
        navigation.navigate('Medications');
      }
      ).catch(e => {
        e.toString() == 'Error: Medication already in user collection'? 
        (Alert.alert('','\nYou have already added this medication'), resetUserInput()) : 
        console.log(e);
      });
  }
  // Reset user input components to default values
  const resetUserInput = () => {
    setMedIcon('1');
    setSelectTime('12:00 AM');
    setStartDate();
    setEndDate();
    setSelectDoW([]);
    setAlarm(false);
    setMedicationToAdd('Add Medication');
    setDrugFunction();
    setDirections();
  }
  
  return (
    <KeyboardAvoidingView style={styles.background} behaviour="padding" enabled>
      <Background />
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <MenuIcon />
      </TouchableOpacity>
      <Animatable.View style={styles.drawer} animation="fadeInUpBig">
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ paddingTop: 5, paddingRight: 10 }} onPress={() => navigation.goBack()}>
              <ReturnIcon />
            </TouchableOpacity>
            <Text 
              style={styles.title}>
                {medicationToAdd != "Add Medication" && medicationToAdd!='' ? 
                createMedicationHeader() : 
                "Add Medication"}
            </Text>
          </View>
        </View>
        <View style={styles.acView}>
          <Autocomplete
            autoCapitalize="sentences"
            autoCorrect={false}
            containerStyle={styles.acContainer}
            inputContainerStyle={styles.acInputContainer}
            listContainerStyle={styles.acListContainer}
            listStyle={styles.acList}
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
          <View style={{ alignItems: 'center', paddingTop:35, paddingBtoom: 15 }}>
            <IconPicker selected={medIcon} onSelect={setMedIcon} />
            <TimePicker value={selectTime} onSelect={setSelectTime} />
          </View>
          <TextInput style={styles.textInput} placeholder="Function" autoCapitalize="none"  onChangeText={(text) => setDrugFunction(text)}
                    value={drugFunction} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
          <TextInput style={styles.textInput} placeholder="Directions for use" autoCapitalize="none"  onChangeText={(text) => setDirections(text)}
           value={directions} returnKeyType='done' onSubmitEditing={Keyboard.dismiss}/>
          <View style={{ paddingBottom: 14 }} />
          <View style={styles.bottomCard}>
            <View>
              <Text style={styles.fieldText}> Start </Text>
              <Text style={styles.fieldText}> Days </Text>
              <Text style={styles.fieldText}> End </Text>
              <Text style={styles.fieldText}> Alarm </Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <View style={{ paddingBottom: 8 }}>
                <DatePicker selected={startDate} onSelect={setStartDate} placeholder="Start Date" />
              </View>
              <DayOfWeekPicker selected={selectDoW} onSelect={setSelectDoW}/>
              <View style={{ paddingBottom: 8 }}>
                <DatePicker selected={endDate} onSelect={setEndDate} placeholder="End Date" />
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
          <Button title="ADD MEDICATION" color="#42C86A" onPress={addMedicationToDB } />
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
            <Text style={styles.modalTitle}>{searchResult}</Text>
          </View>
          <FlatList
            style={{ margin: 0 }}
            data={drugList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={()=>{setMedicationToAdd(item); setShowModal(false); setSearchResult('');}}>
                <MedicationCard>
                  <View style={{ justifyContent: 'center', flex: 2 }}>
                    <PinkMedication />
                  </View>
                  <View style={styles.medicationInfoView}>
                    <Text style={styles.medicationFont}>{item.nameDisplay}</Text>
                    <Text style={styles.doseFont}>{item.doseForm}</Text>
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
  background: {
    flex: 1,
    backgroundColor: '#42C86A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    marginRight: 15,
  },
  title: {
    fontFamily: 'roboto-regular',
    fontSize: 24,
    fontWeight: '100',
  },
  fieldText: {
    fontFamily: 'roboto-regular',
    fontSize: 14,
    fontWeight: '100',
    paddingBottom: 8,
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
  bottomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFF',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 15,
    paddingBottom: 7,
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
    top: screenHeight * 0.15,
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
  modalTitle: {
    fontFamily: 'roboto-regular',
    fontSize: 24,
    fontWeight: '100',
  },
  // view surrounding entire autocomplete component
  acView: {
    flex: 1,
    marginBottom: 45,
  },
  // container surround autocomplete input and list components
  acContainer: {
    //backgroundColor:'rgba(63, 116, 191,1)', // blue
    flex: 1,
    width: '100%',
    position: 'absolute',
  },
  // container that surrounds textinput component
  acInputContainer: {
    backgroundColor: 'rgba(246, 247, 120,1)', // yellow
    borderStartWidth: 0,
    borderEndWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },
  // container that surrounds result list
  acListContainer: {
    //backgroundColor: 'rgba(204, 38, 9,1)', // red
    flex: 1,
    height: screenHeight*0.55,
  },
  // result list
  acList: {
    // backgroundColor: 'rgba(7, 204, 9,1)', // green
    margin: 0,
    padding: 4,
    flex: 1,
  },
  acListItem: {
  },
  acListFont: {
    fontFamily: 'roboto-regular',
    fontSize: 18,
    fontWeight: '100',
    padding: 2,
  },
  medicationFont: {
    fontFamily: 'roboto-regular',
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.85)',
  },
  doseFont: {
    fontFamily: 'roboto-regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
    paddingTop: 5,
  },
  textInput: {
    borderBottomColor: 'rgba(112, 112, 112, 0.7)',
    borderBottomWidth: 1.5,
    fontSize: 16,
    marginVertical: 10,
},
});

export default AddMedicationScreen;