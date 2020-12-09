import React, { useState, useEffect, useContext }from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import Background from '../components/background.js';
import BackgroundHP from '../components/BackgroundHP.js';
import MenuIcon from '../assets/images/menu-icon.svg';
import HPMenuIcon from '../assets/images/hp-menu-icon.svg';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import EditIcon from '../assets/images/edit-icon.svg';
import ImagePicker from '../components/ImagePicker';
import UserIconIndex from '../components/UserImages';
import { UserContext } from '../components/UserProvider/UserContext';
const UserProfileScreen = ({navigation}) => {
    //state declare

    const { accountType } = useContext(UserContext);

    const [user, setUser] = useState();
    const [images, setimages] = useState([
        require('../assets/images/dp1.svg'),
        require('../assets/images/dp2.svg'),
        require('../assets/images/dp3.svg'),
        require('../assets/images/dp4.svg'),
        require('../assets/images/dp5.svg'),
        require('../assets/images/dp6.svg'),
        require('../assets/images/dp7.svg'),
        require('../assets/images/dp8.svg'),
        require('../assets/images/dp9.svg')
      ]);
    

    const onEditUser = () => {
        navigation.navigate('EditUserProfileScreen');
    };
    
    const usersRef = firebase.firestore().collection('users')
    const getUser = async () => {
        const {uid} = firebase.auth().currentUser;

      try {
        const documentSnapshot = await usersRef
          .doc(uid)
          .get();
  
        const userData = documentSnapshot.data();
        // console.log(userData);

        setUser(userData);
      } catch(error) {
        alert(error);
      }
    };
    // Get user on mount
    useEffect(() => {
      getUser();
    }, []);

  

return (
      
    <View style={styles.container}>
        {(accountType === "HEALTH_PROFESSIONAL") ? <BackgroundHP /> : <Background />}
    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            {(accountType === "HEALTH_PROFESSIONAL") ? <HPMenuIcon /> : <MenuIcon />}
    </TouchableOpacity>
    <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight / 10 }}>
        <NurseEllieLogo height={75} style={{ flex: 1, marginRight: '5%' }} />
        <Text style={{ fontFamily: 'roboto-regular', fontSize: 25, paddingRight: 30}}> {`User Profile`}</Text>
        <TouchableOpacity onPress={() => { onEditUser(); }}>
            <EditIcon />
    </TouchableOpacity>
    </View>
    <View>
    {user && <ImagePicker disabled selected={user.image} onSelect={() => { }} />}
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Full name: {user && user?.fullName}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Email : {user && user?.email}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Gender : {user && user?.gender}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>
        Date Of Birth: {user && user.date && user.date.seconds && new Date(user.date.seconds * 1000).toLocaleDateString("en-US")}
    </Text>
   
   
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
