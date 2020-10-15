import React from 'react';
import {Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Modal from 'react-native-modalbox';

const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isModalOpen: false,
          value: props.value,
        };
      }
}

export default Component;