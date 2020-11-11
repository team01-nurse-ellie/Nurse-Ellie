import { Dimensions, StyleSheet } from 'react-native';

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

const PatientStyle = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#42C86A',
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
  menuButton:{
    position: 'absolute',
    right: 30,
    top: 40 
  },
  header:{
    flexDirection:'row', 
    justifyContent: 'space-between', 
    paddingBottom: 10
  },
  title: {
    fontFamily: 'roboto-regular',
    fontSize: 24,
    fontWeight: "100",
  }, 
  clickableFont: {
    fontFamily: 'roboto-medium',
    fontSize: 14, 
  },
  descriptionFont: {
    fontFamily: 'roboto-regular', 
    fontSize: 12, 
    color: 'rgba(0, 0, 0, 0.38)', 
  },
});

export default PatientStyle;