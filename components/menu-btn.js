import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Dimensions } from 'react-native';
import MenuDrawerBtn from '../assets/images/menu-icon.svg';
// import MenuDrawerBtn from '../assets/android/drawable-hdpi/patient-menu.png';

const MenuBtn = () => {
    return (
        <>
            <TouchableOpacity style={{ marginRight: 25, marginTop: 20, }}>
                <MenuDrawerBtn height={27} />
                {/*    <Image source={MenuDrawerBtn} style={{
                    height: 27,
                    resizeMode: 'contain',
                }} /> */}
            </TouchableOpacity>
        </>
    );
};

export default MenuBtn;