import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Modal from 'react-native-modalbox';
import CheckBox from '@react-native-community/checkbox';

const DAYS_OF_WEEK = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selected: new Set(props.selected),
    };
  }

  static getDerivedStateFromProps(newProps, prevState) {
    if (newProps.selected !== prevState.selected) {
      return {
        selected: new Set(newProps.selected),
      }
    }
  }

  onModalOpen = () => {
    if (!this.state.isModalOpen) {
      this.setState({ isModalOpen: true });
    }
  };

  onModalClose = () => {
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: false });
    }
  };

  onSelectDay = index => {
    if (this.state.selected.has(index)) {
      if (this.state.selected.delete(index)){
        this.props.onSelect(Array.from(this.state.selected));
      } else {
        console.log("error");
        this.props.onSelect(Array.from(this.state.selected));
      }
    }
    this.state.selected.add(index);
    this.props.onSelect(Array.from(this.state.selected));
  };

  onConfirm = () => {
    this.props.onSelect(Array.from(this.state.selected));
    this.onModalClose();
  };

  renderSelectedDays() {
    const selected = Array.from(this.state.selected);
    return <Text>{selected.map((index) => DAYS_OF_WEEK[index]).join(', ')}</Text>;
  }

  render() {
    const { isModalOpen, selected } = this.state;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={this.onModalOpen}>
          {this.renderSelectedDays()}
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
            <Text style={styles.heading}> Select Medication Days: </Text>
            <View>
              {DAYS_OF_WEEK.map((day, index) => (
                <View key={day} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox value={selected.has(index)} onValueChange={() => this.onSelectDay(index)} />
                  <Text> {day} </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={this.onConfirm}>
              <Text> Confirm </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    padding: 20,
  },
  innerModal: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  heading: {
    paddingTop: 15,
    paddingBottom: 10,
    fontFamily: 'roboto-regular',
    fontSize: 20,
  },
  confirmButton: {
    paddingTop: 10,
    paddingBottom: 15,
  },
});

export default Component;
