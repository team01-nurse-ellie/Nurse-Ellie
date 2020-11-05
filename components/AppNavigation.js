import React, { useState, useEffect, useContext } from 'react';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
// Styling
import { patient_styles, hp_styles } from '../general-stylesheet';

// Auth Context
import { FirebaseAuthContext } from './Firebase/FirebaseAuthContext';

// Components
import DrawerContent from "./DrawerContent";

// Screens
import QRScreen from '../screens/QRScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserLinkScreen from '../screens/UserLinkScreen';
import PatientListScreen from '../screens/PatientListScreen';
import AddMedicationScreen from '../screens/AddMedicationScreen';
import EditMedicationScreen from '../screens/EditMedicationScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';
import MedicationListScreen from '../screens/MedicationListScreen';
import MedicationDetailScreen from '../screens/MedicationDetailScreen';
import HealthProfessionalScreen from '../screens/HealthProfessionalScreen';
import SymptomChecklistScreen from '../screens/SymptomChecklistScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MedicationSummaryScreen from '../screens/MedicationSummaryScreen';

// Navigation modules
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigation = () => {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const { currentUser } = useContext(FirebaseAuthContext);
    const [accountType, setAccountType] = useState("patient");

    useEffect(() => {
        setIsSignedIn(Boolean(currentUser));
    }, []);

    const DrawerRoutes = () => {
        return (
            <Drawer.Navigator drawerPosition='right' drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Medications" component={MedicationListScreen} />
                <Drawer.Screen name="AddMedication" component={AddMedicationScreen} />
                <Drawer.Screen name="Medication" component={MedicationDetailScreen} />
                <Drawer.Screen name="Patients" component={PatientListScreen} />
                <Drawer.Screen name="Patient" component={PatientDetailScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
                <Drawer.Screen name="UserLinkScreen" component={UserLinkScreen} />
                <Drawer.Screen name="HealthProfessional" component={HealthProfessionalScreen} />
                <Drawer.Screen name="SymptomChecklistScreen" component={SymptomChecklistScreen} />
                <Drawer.Screen name="NotificationScreen" component={NotificationScreen}/>
                <Drawer.Screen name="EditMedication" component={EditMedicationScreen}/>
                <Drawer.Screen name="MedicationSummary" component={MedicationSummaryScreen}/>
            </Drawer.Navigator>
        );
    }

    return (
        <>
            <StatusBar backgroundColor={(accountType == "patient") ? patient_styles.background.backgroundColor : hp_styles.background.backgroundColor} />
            <SafeAreaView style={{
                flex: 1,
                // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
            }}>
                <NavigationContainer>
                    <RootStack.Navigator>
                        {currentUser ? (
                            <>
                                <RootStack.Screen name="HomeScreen" component={DrawerRoutes} options={{ headerShown: false }} />
                                <RootStack.Screen name="QRScreen" component={QRScreen} options={{ 
                                    transitionSpec: {
                                        // Disables the animation when pushing the screen. 
                                        open: {
                                            animation: 'timing',
                                            config: {
                                                duration: 0,
                                            }
                                        }, 
                                        // Requires a close object for when screen is popped. 
                                        close: TransitionSpecs.TransitionIOSSpec   
                                    },
                                    // Color of header depending on account type.
                                    headerStyle: { backgroundColor: (accountType == "patient") ? patient_styles.background.backgroundColor : hp_styles.background.backgroundColor}, title: "Scan" }} />
                            </>
                        ) : (
                                <>
                                    <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                                    <RootStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
                                    <RootStack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
                                </>
                            )
                        }
                    </RootStack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </>
    )
};

export default AppNavigation;