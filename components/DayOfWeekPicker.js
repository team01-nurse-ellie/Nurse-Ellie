import React from 'react';
import {Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Modal from 'react-native-modalbox';
import CheckBox from '@react-native-community/checkbox';

const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isModalOpen: false,
          selected: props.value,
        };
      }

      render(){
        const { current, isModalOpen, selected } = this.state;
        return (
          <React.Fragment>
            <TouchableWithoutFeedback>
              <Text> Place Holder</Text>
            </TouchableWithoutFeedback>
          </React.Fragment>
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
          </Modal>
        )
      }
}

export default Component;