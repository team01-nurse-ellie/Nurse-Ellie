import React, { useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { firebase } from "./Firebase/config.js";
import { UserContext } from './UserProvider/UserContext.js';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { Text, Drawer } from 'react-native-paper';


function DrawerContent(props) {

    const { accountType } = useContext(UserContext);

    return (
        <View>
            <DrawerContentScrollView {...props}>
                <View>
                    <Text> Name </Text>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                    label="Home"
                    onPress={() => { props.navigation.navigate('Home') }}
                />
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem
                        label="Medication List"
                        onPress={() => { props.navigation.navigate('Medications') }}
                    />
                    <DrawerItem
                    label="User Profile"
                    onPress={() => { props.navigation.navigate('UserProfile') }}
                />
                </Drawer.Section>
                <DrawerItem
                    label="Account Change"
                    onPress={() => { props.navigation.navigate('HealthProfessional') }}
                />
                {(accountType === "HEALTH_PROFESSIONAL") &&
                    <DrawerItem
                        label="Patient List"
                        onPress={() => { props.navigation.navigate('Patients') }}
                />}

                <DrawerItem
                    label="User Connect"
                    onPress={() => { props.navigation.navigate('UserLinkScreen') }}
                />
                {(accountType === "PATIENT") && <DrawerItem
                    label="Symptom Checklist"
                    onPress={() => { props.navigation.navigate('SymptomChecklist') }}
                />}
                <DrawerItem
                    label="Alarm"
                    onPress={() => { props.navigation.navigate('NotificationScreen') }}
                />
                {(accountType === "PATIENT") && <DrawerItem
                    label="Medication Summary"
                    onPress={()=> {props.navigation.navigate('MedicationSummary')}}
                />}
                <DrawerItem
                    label="Home (Health Professional)"
                    onPress={()=> { props.navigation.navigate('HomeScreenHP')}}
                />
            </Drawer.Section>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Sign Out"
                    onPress={() => { firebase.auth().signOut() }}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 15
    }
})

export default DrawerContent;