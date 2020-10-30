import React from 'react';
import { View, StyleSheet } from 'react-native';
import { firebase } from "./Firebase/config.js";

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { Text, Drawer } from 'react-native-paper';


function DrawerContent(props){


    return (
        <View>
            <DrawerContentScrollView {... props}>
                <View>
                    <Text> Name </Text>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.drawerSection}>
           
                <DrawerItem
                    label="Home"
                    onPress={() =>{props.navigation.navigate('Home')}}
                />
                 <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                   label="Medication List"
                   onPress={()=>{props.navigation.navigate('Medications')}}
                />
                </Drawer.Section>
                 <DrawerItem
                    label="Health Professional"
                    onPress={()=>{props.navigation.navigate('HealthProfessional')}}
                />
                <DrawerItem
                    label="Setting"
                    onPress={()=>{props.navigation.navigate('Settings')}}
                />
                  <DrawerItem
                    label="User Profile"
                    onPress={()=>{props.navigation.navigate('UserProfile')}}
                />
            </Drawer.Section>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Sign Out"
                    onPress={() =>{firebase.auth().signOut()}}
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
    bottomDrawerSection:{
        marginBottom: 15
    }
})

export default DrawerContent;