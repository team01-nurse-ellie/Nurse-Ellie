import isString from 'lodash/isString';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modalbox';

const CALENDAR_THEME = {
  textSectionTitleColor: '#707070', 
  selectedDayBackgroundColor: '#42C86A',
  selectedDayTextColor: '#FFFFFF',
  todayTextColor: '#42C86A', 
  dayTextColor: '#707070', 
  arrowColor: '#707070', 
  monthTextColor: '#707070', 
  textDayFontFamily: 'roboto-regular',
  textDayFontSize: 12,
  textDayHeaderFontFamily: 'roboto-regular',
  textDayHeaderFontSize: 12,
  textMonthFontFamily: 'roboto-regular',
  textMonthFontSize: 12,
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { selected } = this.props;
    if (selected) {
      const dateString = moment(selected).format('YYYY-MM-DD');
      this.setState({
        current: dateString,
        selected: dateString,
      });
    }
  }

  onDayPress = (day) => {
    this.setState({ selected: day.dateString });
  };

  onCancel = () => {
    const { selected } = this.props;
    const dateString = moment(selected).format('YYYY-MM-DD');
    this.setState({ selected: selected ? dateString : undefined }, this.onModalClose);
  };

  onSelect = () => {
    this.props.onSelect(moment(this.state.selected).toISOString());
    this.onModalClose();
  };

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

  getMarkedDates = () => ({
    [this.state.selected]: {
      selected: true,
    },
  });

  clearDate = () => {
    this.setState({ selected: undefined });
  };

  render() {
    const { current, isModalOpen, selected: marked } = this.state;
    const { selected } = this.props;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={this.onModalOpen} style={styles.container}>
          <Text style={[styles.fieldValue, !selected && styles.placeholderText]}>
            {selected ? moment(selected).format('MMMM Do, YYYY') : this.props.placeholder}
          </Text>
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
          <View style={styles.modal}>
            <Calendar
              current={current}
              markedDates={this.getMarkedDates()}
              onDayPress={this.onDayPress}
              style={styles.calendar}
              theme={CALENDAR_THEME}
            />
            <View style={styles.actions}>
              <View style={styles.left}>
                <TouchableOpacity onPress={this.clearDate} style={styles.button}>
                  <Text style={styles.modalAction}>Clear</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.onCancel} style={styles.button}>
                <Text style={styles.modalAction}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isString(marked)}
                onPress={this.onSelect}
                style={[styles.button, styles.select, marked ? styles.primary : styles.disabled]}
              >
                <Text style={marked ? styles.modalPrimaryAction : styles.modalAction}>Select</Text>
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
    textAlignVertical: 'center',
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
  calendar: {
    alignSelf: 'stretch',
    paddingBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  left: {
    flex: 1,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: '#42C86A',
  },
  disabled: {
    backgroundColor: 'rgba(112, 112, 112, 0.4)',
  },
  select: {
    marginLeft: 15,
  },
  fieldValue:{
    color: '#707070',
    fontFamily: 'roboto-regular',
    fontSize: 14,
  }, 
  placeholderText:{
      color: '#707070'
  }, 
  modalAction: {
    color: '#707070',
    fontFamily: 'roboto-regular',
    fontSize: 12,
  },
  modalPrimaryAction: {
    color: '#FFFFFF',
    fontFamily: 'roboto-regular',
    fontSize: 12,
  },
});

Component.propTypes = {
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  selected: PropTypes.string,
};

export default Component;
