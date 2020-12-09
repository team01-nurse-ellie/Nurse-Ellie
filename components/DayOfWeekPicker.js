import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Modal from 'react-native-modalbox';
import CheckBox from '@react-native-community/checkbox';
import { dateDifference } from '../utils/dateHelpers.js';

const DAYS_OF_WEEK = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_OF_WEEK_ABBREV = ['Sun', 'Mon', 'Tu', 'Wed', 'Th', 'Fri', 'Sat'];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selected: new Set(props.selected),
      showPrompt: {
        datesProvided: true,
        invalidDates: false
      },
      DOW: [0, 1, 2, 3, 4, 5, 6]
    };
  }

  checkPrompts = (startDate, endDate) => {

    if (startDate != null && endDate != null) {

      this.setState((prevState) => ({ showPrompt: { ...prevState.showPrompt, datesProvided: true } }));

      if (startDate > endDate) {
        this.setState((prevState) => ({ showPrompt: { ...prevState.showPrompt, invalidDates: true } }));
      } else {
        this.setState((prevState) => ({ showPrompt: { ...prevState.showPrompt, invalidDates: false } }));
      }

    } else {
      this.setState((prevState) => ({ showPrompt: { ...prevState.showPrompt, datesProvided: false } }));
    }
    
  }

  componentDidMount() { this.checkPrompts(this.props.startDate, this.props.endDate); }

  componentDidUpdate(prevProps) {

    const { startDate, endDate, selected } = this.props;

    if (this.props?.screenType && this.props.screenType === "Edit Medication") {
        
      if (selected.length != 0 && (startDate != prevProps.startDate || endDate != prevProps.endDate)) {
        this.setState({ selected: new Set(selected) }, () => {
          console.log("re-0render")
          this.renderSelectedDays();
        });
      }
      
        if ((prevProps.startDate != startDate && prevProps.selected.length != 0) || (prevProps.endDate != endDate && prevProps.selected.length != 0)) {
          // if (this.props.selected.length == 0) {
            let newSelected = [];
            this.setState({ selected: new Set(newSelected) }, () => {
              this.props.onSelect(Array.from(this.state.selected));
              this.renderSelectedDays();
            });
           
        }
          
    }

    // When leaving screen, it will reset the DoW rendered days. 
    // console.log(`RE-RENDERING`, selected.sort((a, b) => a > b));
  
    if (this.props?.screenType && this.props.screenType === "Add Medication") {
      if (selected.length != prevProps.selected.length) {
        // if array is empty
        if (selected.length < 1) {
          console.log("TIS BEING CALLED")
          // clears the previous rendered days of week. 
          this.setState({ selected: new Set(selected) }, () => {
            this.renderSelectedDays();
          });
        }

      }
  }

    if (startDate != prevProps.startDate || endDate != prevProps.endDate) {
      this.checkPrompts(startDate, endDate);
    } else {
      console.log("DoW props SAME");
    }

  }

  disableCheckbox = (dayIndex) => {

    const { startDate, endDate } = this.props;

    let DOW = this.state.DOW;

    if (startDate != null && endDate != null) {
      if (startDate > endDate) {
        // INVALID DATES, DISABLE ALL CHECK BOXES!!!
        return true;
      } else {

        let scheduledDays = dateDifference(endDate, startDate);

        if (scheduledDays < 7) {

          const date1 = new Date(startDate);
          let beginCount = false;
          let startDateDOWPOS = 0;

          if (scheduledDays === 1) {
            for (let i = 0; i < DOW.length; i++) {
              if (DAYS_OF_WEEK[date1.getDay()] !== DAYS_OF_WEEK[i]) {
                DOW[i] = undefined;
              }
            }
          }

          // loops for the days between start to end 
          for (let i = 1; i < scheduledDays; i++) {
            if (beginCount == false) {
              for (let j = 0; j < DAYS_OF_WEEK.length; j++) {
                // start counting DoW from startDate by Saving first day
                if (DAYS_OF_WEEK[date1.getDay()] === DAYS_OF_WEEK[j]) {
                  beginCount = true;
                  startDateDOWPOS = j;
                  DOW[j] = j;
                } else {
                  DOW[j] = undefined;
                }
              }
            }

            // if startDate DOW != to saturday. 
            if (DAYS_OF_WEEK[startDateDOWPOS] !== DAYS_OF_WEEK[DAYS_OF_WEEK.length - 1]) {
              // use ++startDateDOWPOS if ++ doesnt work.
              startDateDOWPOS++;
              DOW[startDateDOWPOS] = startDateDOWPOS;
              // noDisableDays.push(startDateDOWPOS++);
            } else {
              // if does, start from sunday - friday 
              startDateDOWPOS = 0;
              DOW[startDateDOWPOS] = startDateDOWPOS;
              // noDisableDays.push(startDateDOWPOS++);
            }
          } // ***End of loop scheduledDays > 1***

          if (dayIndex === DOW[dayIndex]) {
            // Enable checkbox - if current day exists in DOW array.
            return false;
          } else {
            // Disable checkbox - if current day DON'T EXIST in DOW array.
            return true;
          }

        } else {
          // Show all days, return false - Enable checkbox
          return false;
        }

      }
    }
    else {
      // DATES ARE NOT PROVIDED, DISABLE CHECK BOX.
      return true;
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
    console.log(index, `onSelectDay()`)
    if (this.state.selected.has(index)) {
      if (this.state.selected.delete(index)){
        this.props.onSelect(Array.from(this.state.selected));
        return;
      } else {
        console.log("error");
        return;
      }
    } else {
      this.state.selected.add(index);
      this.props.onSelect(Array.from(this.state.selected));
    }
  };

  onConfirm = () => {
    this.props.onSelect(Array.from(this.state.selected));
    this.onModalClose();
  };

  renderSelectedDays() {
    const selected = Array.from(this.state.selected);
    let sortedSelected = selected.sort((a, b) => a > b);
    return <Text>{sortedSelected.map((index) => DAYS_OF_WEEK_ABBREV[index]).join(', ')}</Text>;
  }
  
  render() {
    const { isModalOpen, selected, showPrompt } = this.state;
    const { startDate, endDate } = this.props;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={() => { this.onModalOpen(); }}>
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
            {/* Show msg if dates are not provided. */}
            {(showPrompt.datesProvided == false) && <Text style={{ color: 'red', fontWeight: 'bold' }}>Provide start and end dates</Text>}
            {/* Show msg if dates are not valid. */}
            {showPrompt.invalidDates && <Text style={{ color: 'red', fontWeight: 'bold' }}>End date is not valid</Text>}
            <View>
              {DAYS_OF_WEEK.map((day, index) => (
                <View key={day} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Turn off checkboxes if the start/end dates are not provided. */}
                  {/* Turn off checkboxes if the dates are not valid (end date earlier than start date). */}
                  <CheckBox
                    key={day}
                    disabled={this.disableCheckbox(index)}
                    value={selected.has(index)}
                    onValueChange={() => this.onSelectDay(index)}
                  />
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
