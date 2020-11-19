import React from 'react';
import {Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import ScrollPicker from 'react-native-wheel-scroll-picker';
import Modal from 'react-native-modalbox';

const HOURS_DATA = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const MINUTES_DATA = Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : String(i));
const AMPM_DATA = ['AM', 'PM'];

class Component extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        value: this.props.value,
      };
    }

    static getDerivedStateFromProps(newProps, prevState) {
      if (newProps.value !== prevState.value) {
        return { value: newProps.value, };
      } else {
        return { value: prevState.value,};
      }
    }

    onModalClose = () => {
      if (this.state.isModalOpen) {
        this.setState({ isModalOpen: false });
      }
    };
  
    onModalOpen = () => {
      if (!this.state.isModalOpen) {
        this.setState({ isModalOpen: true });
      }
    };

    calculateTimeFromHourPicker(selectedValue) {
      const stateMinutes = Math.floor((this.state.value % 3600) / 60);
      const stateAMPM = Math.floor(this.state.value / 43200);
      const nextValue = Number(selectedValue) * 3600 + stateMinutes * 60 + stateAMPM * 43200;
      this.props.onSelect(nextValue);
    }

    calculateTimeFromMinutePicker(selectedValue) {
      const stateHours = Math.floor((this.state.value % 43200) / 3600);
      const stateAMPM = Math.floor(this.state.value / 43200);
      const nextValue = stateHours * 3600 + Number(selectedValue) * 60 + stateAMPM * 43200;
      this.props.onSelect(nextValue);
    }

    calculateTimeFromAMPMPicker(selectedValue) {
      const selectedAMPM = selectedValue === 'AM' ? 0 : 43200;
      const stateHours = Math.floor((this.state.value % 43200) / 3600);
      const stateMinutes = Math.floor((this.state.value % 3600) / 60);
      const nextValue = stateHours * 3600 + stateMinutes * 60 + selectedAMPM;
      this.props.onSelect(nextValue);
    }

    getIndexForHourPicker(value) {
      return Math.floor((value % 43200) / 3600);
    }

    getIndexForMinutePicker(value) {
      return Math.floor((value % 3600) / 60);
    }

    getIndexForAMPMPicker(value) {
      return Math.floor(value / 43200);
    }

    getValueFormatted() {
      const value = this.state.value;
      const hourValue = HOURS_DATA[this.getIndexForHourPicker(value)];
      const minuteValue = MINUTES_DATA[this.getIndexForMinutePicker(value)];
      const ampmValue = AMPM_DATA[this.getIndexForAMPMPicker(value)];
      return `${hourValue}:${minuteValue} ${ampmValue}`;
    }

    onSelect() {
      this.props.onSelect(this.state.value);
      this.onModalClose();
    }
    
    render(){
      const { isModalOpen, value } = this.state;
      return (
        <React.Fragment>
          <TouchableWithoutFeedback onPress={this.onModalOpen} style={styles.container}>
            <Text style={styles.displayText}>{this.getValueFormatted()}</Text>
          </TouchableWithoutFeedback>
          <Modal
            animationDuration={300}
            backButtonClose
            backdropOpacity={0.7}
            coverScreen
            easing={Easing.out(Easing.ease)}
            isOpen={isModalOpen}
            onClosed={this.onModalClose}
            style={styles.backdrop}
            swipeToClose={false}
          >
            <View style={styles.innerModal}>
              <View style={styles.pickerRow}>
                <ScrollPicker
                  dataSource={HOURS_DATA}
                  selectedIndex={this.getIndexForHourPicker(value)}
                  renderItem={(item, index, isSelected) => item}
                  onValueChange={(selectedValue, selectedIndex) => {
                      this.calculateTimeFromHourPicker(selectedValue);
                  }}
                  wrapperHeight={180}
                  wrapperWidth={40}
                  wrapperBackground={'#FFFFFF'}
                  itemHeight={60}
                  highlightColor={'#d8d8d8'}
                  highlightBorderWidth={2}
                  activeItemColor={'#222121'}
                  itemColor={'#B4B4B4'}
                />
                <Text> : </Text>
                <ScrollPicker
                  dataSource={MINUTES_DATA}
                  selectedIndex={this.getIndexForMinutePicker(value)}
                  renderItem={(item, index, isSelected) => item}
                  onValueChange={(selectedValue, selectedIndex) => {
                    this.calculateTimeFromMinutePicker(selectedValue);
                  }}
                  wrapperHeight={180}
                  wrapperWidth={50}
                  wrapperBackground={'#FFFFFF'}
                  itemHeight={60}
                  highlightColor={'#d8d8d8'}
                  highlightBorderWidth={2}
                  activeItemColor={'#222121'}
                  itemColor={'#B4B4B4'}
                />
                <ScrollPicker
                  dataSource={AMPM_DATA}
                  selectedIndex={this.getIndexForAMPMPicker(value)}
                  renderItem={(item, index, isSelected) => item}
                  onValueChange={(selectedValue, selectedIndex) => {
                    this.calculateTimeFromAMPMPicker(selectedValue);
                  }}
                  wrapperHeight={180}
                  wrapperWidth={50}
                  wrapperBackground={'#FFFFFF'}
                  itemHeight={60}
                  highlightColor={'#d8d8d8'}
                  highlightBorderWidth={2}
                  activeItemColor={'#222121'}
                  itemColor={'#B4B4B4'}
                />
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.baseButton, styles.cancelButton]} onPress={this.onModalClose}>
                  <Text style={{color: '#FFFFFF'}}> Cancel </Text>
                </TouchableOpacity>
                <View style={{paddingHorizontal: 75}}/>
                <TouchableOpacity style={[styles.baseButton, styles.selectButton]} onPress={this.onSelect.bind(this)}>
                  <Text style={{color: '#FFFFFF'}}>Select</Text>                  
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </React.Fragment>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center'
  },
  displayText: {
    fontFamily: 'roboto-regular', 
    fontSize: 36, 
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
  },
  fieldValue:{
    color: '#707070',
    fontFamily: 'roboto-regular',
    fontSize: 14,
  }, 
  placeholderText:{
      color: '#707070'
  },
  innerModal: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  pickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5, 
    paddingBottom: 10
  },
  baseButton: {
    borderRadius: 30,
    marginLeft: 5,
    paddingHorizontal: 10
  },
  cancelButton: {
    backgroundColor: "#B4B4B4",
  },
  selectButton: {
    backgroundColor: "#42C86A",
  },
});
export default Component;