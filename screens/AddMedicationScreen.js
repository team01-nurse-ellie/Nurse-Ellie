import React, {useState, useEffect} from 'react';
import { View, Text, Button, TextInput, Switch, KeyboardAvoidingView, TouchableOpacity, Dimensions, StyleSheet, Alert, FlatList} from 'react-native';

import * as Animatable from 'react-native-animatable';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import Autocomplete from 'react-native-autocomplete-input';
import Modal from 'react-native-modal';

import Background from '../components/background';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import IconPicker from '../components/IconPicker';
import MenuIcon from '../assets/images/menu-icon.svg';
import MedicationsIcon from '../assets/images/medications-icon';
import ReturnIcon from '../assets/images/return-arrow-icon.svg';
import SearchIcon from '../assets/images/search-icon';
import PinkMedication from '../assets/images/pink-medication-icon';
import MedicationCard from '../components/MedicationCard';

import { getAllByConcepts, getDrugsByIngredientBrand,getIndUseByRxcui} from '../utils/medication';

const AddMedicationScreen = ({ navigation }) => {
    const currentTime = new Date();
    const [medIcon, setMedIcon] = useState('1');
    const [selectTime, setSelectTime] = useState(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [alarm, setAlarm] = useState('false');
    const [showModal, setShowModal] = useState(false);
    const toggleSwitch = () => setAlarm(previousState => !previousState);
    //const [hideResults, setHideResults] = useState(false);
    // master rxcui term list (all possible ingredients and brand-names)
    const [masterRxcui, setMasterRxcui] = useState([])
    // filtered rxcui term list (filtered list of ingredients and brand-names)
    const [filterRxcui, setFilterRxcui] = useState([]);
    // filtered list of drugs (drug = ingredient+form+strength) based on user-selected ingredient or brand-name
    const [drugList, setDrugList] = useState([])

    useEffect(() => {
        load()
    }, [])

    // load master list of molecules and brand-names
    async function load() {
        try {
            //const ingredientsBrand = await getAllByConcepts(['IN','BN','MIN']);
            const ingredientsBrand = await getAllByConcepts(['IN','BN']);
            await setMasterRxcui(ingredientsBrand);
        } catch (error) { console.log(error)}
    }

    // returns filtered sub-set of master rxnow query
    const filterByTerm = (term) =>{
        if (term.length < 1) { return [];}
        var searchIngrBrand = term.trim();
        searchIngrBrand = searchIngrBrand.replace(/[() ]/g, '\\$0')
        const regex = new RegExp(searchIngrBrand,'i');
        const filterList = (masterRxcui[0] ? masterRxcui.filter(ingredientBrand=>ingredientBrand.name.search(regex) >= 0) : []);
        return filterList;
    }

    // AutoComplete item based on user text input (by ingredients/brand name)
    const renderItem = ({item}) => (
        <TouchableOpacity>
            <Text style={styles.acDescriptionFont} onPress={()=> renderDrugListModal(item.name)}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    // Shows modal and populates ListView of modal with MedicationCard
    const renderDrugListModal = async (drug) => {
        console.log('drug selected: ' + drug);
        const drugList = await getDrugsByIngredientBrand(drug);
        setDrugList(drugList);
        //console.log(drugList);
        if (drugList.length > 0 ) {setFilterRxcui([]); setShowModal(true)};
    }
    // Retrieve OpenFda API labelling info for Rxcui
    const addIndicationToDrug = async (drug) => {
        // get label info for rxcui
        const indication = await getIndUseByRxcui(drug.rxcui);
        // add to rxcui (drug) object
        drug.information = await indication;
    }
    
    return (
        <KeyboardAvoidingView style={styles.background} behaviour='padding' enabled>
            <Background />
            <TouchableOpacity style={styles.menuButton} onPress={()=> navigation.openDrawer()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Modal
            style={styles.modalDrawer} 
            isVisible={showModal}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            onBackButtonPress={()=> setShowModal(false)}
            backdropOpacity={0}
            onModalWillShow={()=> getDrugsByIngredientBrand()}
            >
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                        Select Medication
                    </Text>
                </View>
                <FlatList
                style={{margin:0}}
                data={drugList}
                renderItem={({ item }) =>
                <TouchableOpacity style={styles.searchButton} onPress={()=> 0}>                         
                    <MedicationCard>
                        <View style={{justifyContent:'center', flex:2}}>
                            <PinkMedication/>
                        </View>
                        <View style={styles.medicationInfoView}>
                            <Text style={styles.medicationFont}>{item.nameDisplay}</Text>
                            <Text style={styles.doseFont}>{item.doseForm}</Text>
                        </View>
                        <View style={styles.strengthView}>
                            <Text style={styles.strengthFont}>{item.strength}</Text>
                        </View>
                    </MedicationCard>
                </TouchableOpacity>}
                keyExtractor={(item,index)=>index.toString()}
                />
            </Modal>
            <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
                <View style={styles.header}>
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={{paddingTop: 5, paddingRight: 10}}onPress={()=> navigation.goBack()}>
                        <ReturnIcon/>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        Add Medication
                    </Text>
                    </View>
                    <TouchableOpacity>
                        <MedicationsIcon/>
                    </TouchableOpacity>
                </View>
                <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.acContainer}
                inputContainerStyle={styles.acInputContainer}
                listContainerStyle={styles.acListContainer}
                listStyle={styles.acList}
                data={filterRxcui}
                defaultValue={''}
                onChangeText={(text) => setFilterRxcui(filterByTerm(text))}
                placeholder="Enter medication"
                renderItem={renderItem}
                keyExtractor={(item,index)=>index.toString()}
                />
                <View style={{alignItems: 'center', paddingVertical: 15}}>
                    <TimePicker
                        value={selectTime}
                        onSelect={setSelectTime}
                    />
                </View>
                <View style={styles.bottomCard}>
                    <View>
                        <Text style={styles.fieldText}> Reminder Times </Text>
                    </View>
                </View>
                <View style={{paddingBottom: 14}}/>
                <View style={styles.bottomCard}>
                    <View>
                        <Text style={styles.fieldText}> Start </Text>
                        <Text style={styles.fieldText}> Days </Text>
                        <Text style={styles.fieldText}> End </Text>
                        <Text style={styles.fieldText}> Alarm </Text>
                    </View>
                    <View style={{justifyContent:'flex-end'}}>
                        <View style={{paddingBottom: 8}}>
                            <DatePicker
                                selected={startDate}
                                onSelect={setStartDate}
                                placeholder="Start Date"/>
                        </View>
                        <Text style={styles.fieldText}> M, W, F </Text>
                        <View style={{paddingBottom: 8}}>
                            <DatePicker 
                                selected={endDate}
                                onSelect={setEndDate}
                                placeholder="End Date" />
                        </View>
                        <Switch 
                            trackColor={{ false: "#767577", true: "#42C86A" }}
                            thumbColor={alarm ? "#F4F3F4" : "#F4F3F4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={alarm}
                        />
                    </View>
                </View>
                <View style={{paddingBottom: 14}}/>
                <Button title="ADD MEDICATION" color='#42C86A' onPress={()=>Alert.alert("medication added")}/>
            </Animatable.View>
        </KeyboardAvoidingView>
    )
}

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#42C86A',
    }, 
    header:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 20
    },
    title: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    },
    fieldText:{
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        fontWeight: '100', 
        paddingBottom: 8
    },
    strengthFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    medicationInfoView: {
        flex:6,
        paddingHorizontal: 10
    },
    strengthView: {
        flex:2,
    },
    bottomCard: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        borderRadius: 10, 
        elevation: 3, 
        backgroundColor: '#FFF', 
        shadowOffset: { width: 1, height: 1}, 
        shadowColor: '#333', 
        shadowOpacity: 0.3, 
        shadowRadius: 2, 
        marginHorizontal: 4, 
        marginVertical: 6, 
        paddingHorizontal: 15, 
        paddingVertical: 15, 
        paddingTop: 15, 
        paddingBottom: 7
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
    modalDrawer: {
        backgroundColor: '#fff', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingVertical: 25, 
        paddingHorizontal: 30, 
        margin:0,
        position: 'absolute',
        width: screenWidth,
        height: screenHeight * 0.85,
        top: screenHeight * 0.15,
    },
    modalHeader:{
        flexDirection:'row', 
        justifyContent: 'space-between', 
        paddingBottom: 20
    },
    modalTitle: {
        fontFamily: 'roboto-regular',
        fontSize: 24,
        fontWeight: "100",
    },
    // container that surrounds result list
    acListContainer: {
        //backgroundColor: 'rgba(204, 38, 9,1)', // red
        height:350,
    },
    // result list
    acList: { 
        //backgroundColor: 'rgba(7, 204, 9,1)', // green
        margin:0,
        padding: 4,
    // container surround autocomplete component
    },
    acContainer: {
        //backgroundColor:'rgba(63, 116, 191,1)', // blue
        elevation: 5,
    },
    acDescriptionFont : {
        fontFamily: 'roboto-regular', 
        fontSize: 18, 
        fontWeight: '100',
        padding: 2,
    },
    // container that surrounds textinput component
    acInputContainer: {
        backgroundColor: 'rgba(246, 247, 120,1)', // yellow
        borderStartWidth:0,
        borderEndWidth:0,
        borderTopWidth:0,
        borderBottomWidth:1,
    },
    medicationFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 20, 
        color: 'rgba(0, 0, 0, 0.85)'
    },
    doseFont: {
        fontFamily: 'roboto-regular', 
        fontSize: 14, 
        color: 'rgba(0, 0, 0, 0.85)',
        paddingTop:5,
    }
});

export default AddMedicationScreen;