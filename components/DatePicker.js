import isString from 'lodash/isString';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modalbox';
import { calculateLocalTimezone } from '../utils/dateHelpers';

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
      dateTimestamp: null,
      date: {
        year: null,
        month: null,
        day: null
      }
    };
  }

  UNSAFE_componentWillMount() {
    const { selected } = this.props;
    // console.log(selected, `will mount`)
    if (selected) {
      const dateString = moment(selected).format('YYYY-MM-DD');
      this.setState({
        current: dateString,
        selected: dateString,
      });
    }
  }
  componentDidMount() {
    
    
    // let date = new Date(this.props.selected)
    // console.log(date.getUTCSeconds())
    // this.setState({day:})
  }
  
  componentDidUpdate(prevProps) {
    // console.log(prevProps, this.props);
    if (this.props.hasOwnProperty(`screenType`)) {
      if (this.props.screenType === `Edit Medication`) {
        const { startDate, endDate } = this.props.timestamp;
        if (startDate != null && this.props.placeholder === "Start Date") { 
          if (this.state.date.day == null) {
            let day = new Date(startDate);
            this.setState({ date: { year: day.getFullYear(), month: day.getMonth() + 1, day: day.getDate() } });
            console.log(`UPDATE START DATE.`) 
          }
        }
        
        if (endDate != null && this.props.placeholder === "End Date") { 
          if (this.state.date.day == null) {
            let day = new Date(endDate);
            this.setState({ date: { year: day.getFullYear(), month: day.getMonth() + 1, day: day.getDate() } });
            console.log(`UPDATE END DATE.`) 
          }
        }
        
        // this.setState({ date: { year: day.year, month: day.month, day: day.day } });
          // this.setState({ selected: day.dateString });
          // this.setState({ dateTimestamp: calculateLocalTimezone(day.timestamp) });
      }
    }
    
    if (prevProps.timestamp.startDate != this.props.timestamp.startDate || this.props.timestamp.endDate != this.props.timestamp.endDate) {

      if (this.props.timestamp.startDate == null && this.props.timestamp.endDate == null) {
        console.log("CLEARR calendar green select bubble");
        this.clearDate();
      }
    }

    // console.log(this.props, `COMP DID UPDATE`)
    // console.log(this.state, `COMP DID UPDATE 222222`)
    // console.log(this.props.selected, `SELECTED!!!!`)
    // console.log(this.state.selected, `STATE SELECTED!!!!`)
    // If a date is chosen, and user changes the time. 
    if (this.state.date.day !== null && this.isTimeNotSame(this.props.time, prevProps.time)) {
      console.log("go change!!!")
      const { date } = this.state;
      const { time } = this.props;
      console.log(`BEFORE updateDateByTime`, date);
      this.updateDateByTime(date, time);
    }
  }
  
  isTimeNotSame = (time, time2) => {        
    return (time.AM_PM !== time2.AM_PM || time.hour !== time2.hour || time.minute !== time2.minute) ? true : false;
  };

  updateDateByTime(date, time) {
    let updatedDateTimestamp = calculateLocalTimezone(null, date.year, date.month, date.day, time.hour, time.minute, time.AM_PM)
    // console.log(updatedDateTimestamp, `updatedDate`);
    this.props.dateTimestamp(updatedDateTimestamp);
  }

  onDayPress = (day) => {
    this.setState({ selected: day.dateString });
    this.setState({ date: { year: day.year, month: day.month, day: day.day } });
    // console.log(day.timestamp)
    this.setState({ dateTimestamp: calculateLocalTimezone(day.timestamp) });
  };

  onCancel = () => {
    const { selected } = this.props;
    const dateString = moment(selected).format('YYYY-MM-DD');
    this.setState({ selected: selected ? dateString : undefined }, this.onModalClose);
  };

  onSelect = () => {
    this.props.onSelect(moment(this.state.selected).toISOString());
    // console.log(this.props)
    // console.log(this.state.dateTimestamp)
    // console.log(this.state.date, this.props.time);
    this.updateDateByTime(this.state.date, this.props.time);
    // this.props.dateTimestamp(this.state.dateTimestamp);
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
    const { current, isModalOpen, selected: marked, dateTimestamp } = this.state;
    const { selected } = this.props;
    const { startDate, endDate } = this.props.timestamp;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={this.onModalOpen} style={styles.container}>
          <Text style={[styles.fieldValue, !selected && styles.placeholderText]}>
            {/* selected ? moment(selected).format('MMMM Do, YYYY') : this.props.placeholder */}
            {((this.props.placeholder == "Start Date") ? startDate : endDate) ? moment(((this.props.placeholder == "Start Date") ? startDate : endDate)).format('MMMM Do, YYYY') : this.props.placeholder}
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
              maxDate={new Date()}
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
  dateTimestamp: PropTypes.func,
  placeholder: PropTypes.string,
  selected: PropTypes.string,
};

export default Component;
