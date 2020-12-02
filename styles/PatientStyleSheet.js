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
  doseFont: {
    fontFamily: 'roboto-regular',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
    paddingTop: 5,
  },
  headerFont: {
    fontFamily: 'roboto-regular',
    fontSize: 32,
    fontWeight: "100",
  },
  medicationFont:{
    fontFamily: 'roboto-regular', 
    fontSize: 20, 
    color: 'rgba(0, 0, 0, 0.85)'
  },
  fieldText:{
    fontFamily: 'roboto-regular',
    fontSize: 14,
    fontWeight: '100',
    paddingBottom: 8,
  },
  card:{
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
  textInput: {
    borderBottomColor: 'rgba(112, 112, 112, 0.7)',
    borderBottomWidth: 1.5,
    fontSize: 16,
  },
  // Auto-Complete Styling
  autoView: {
    flex: 1,
    marginBottom: 45,
  },
  autoContainer: {
    flex: 1,
    width: '100%',
    position: 'absolute',
  },
  autoInputContainer: {
    backgroundColor: 'rgba(246, 247, 120,1)', 
    borderStartWidth: 0,
    borderEndWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },
  autoListContainer: {
    flex: 1,
    height: screenHeight*0.55,
  },
  autoList: {
    margin: 0,
    padding: 4,
    flex: 1,
  },
  autoListFont: {
    fontFamily: 'roboto-regular',
    fontSize: 18,
    fontWeight: '100',
    padding: 2,
  },
  // Modal Styling

});

export default PatientStyle;