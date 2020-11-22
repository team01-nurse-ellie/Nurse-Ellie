import React, { useState, useEffect }from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../components/Firebase/config'
import Background from '../components/background';
import MenuIcon from '../assets/images/menu-icon';
var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;
import NurseEllieLogo from '../assets/images/nurse-ellie-logo.svg';
import EditIcon from '../assets/images/edit-icon.svg';

const EditUserProfileScreen = ({navigation}) => {
    //state declare
    const usersRef = firebase.firestore().collection('users')
    const [user, setUser] = useState();
    const {uid} = firebase.auth().currentUser;
  
    const onEditUser = () => {
        navigation.navigate('UserProfileScreen');
    };

    const getUser = async () => {
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
return (
      
    <View style={styles.container}>
        <Background/>
    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <MenuIcon />
    </TouchableOpacity>
    <Animatable.View style={styles.drawer} animation="fadeInUpBig"> 
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight / 10 }}>
        <NurseEllieLogo height={75} style={{ flex: 1, marginRight: '5%' }} />
        <Text style={{ fontFamily: 'roboto-regular', fontSize: 25, paddingRight: 30}}> {`User Profile`}</Text>
        <TouchableOpacity onPress={() => { onEditUser(); forceUpdate()}}>
<EditIcon />
    </TouchableOpacity>
    </View>
    <View>
   
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Full name: {user && user?.fullName}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Email : {user && user?.email}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Gender : {user && user?.gender}</Text>
    <Text style={{fontSize: 18, color: "black", alignContent: "flex-start", paddingLeft: 0}}>Date Of Birth : {user && user?.bdate}</Text>
                    
        
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

export default EditUserProfileScreen;
