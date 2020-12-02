import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Modal from 'react-native-modalbox';
import CheckBox from '@react-native-community/checkbox';
import { dateDifference } from '../utils/dateHelpers.js';

const DAYS_OF_WEEK = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_OF_WEEK_ABBREV = ['Sun', 'Mon', 'Tu', 'Wed', 'Th', 'Fri', 'Sat'];
let DOW = [0, 1, 2, 3, 4, 5, 6];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selected: new Set(props.selected),
      showPrompt: {
        datesProvided: true,
        invalidDates: false
      }
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

  componentDidMount() {
    this.checkPrompts(this.props.startDate, this.props.endDate);
  }

  componentDidUpdate(prevProps) {

    const { startDate, endDate, selected } = this.props;

    // When leaving screen, it will reset the DoW rendered days. 
    if (selected.length != prevProps.selected.length) {
      // if array is empty
      if (selected.length < 1) {
        // clears the previous rendered days of week. 
        this.setState({ selected: new Set(selected) }, () => {
          this.renderSelectedDays();
        });
      }

    }
    if (startDate != prevProps.startDate || endDate != prevProps.endDate) {
      this.checkPrompts(startDate, endDate);
    } else {
      console.log("DoW props are the same");
    }

    // if (startDate == null & endDate == null) {
    //   this.setState({hasDates: false});
    // } else {
    //   this.setState({hasDates: true});
    // }
    
  }

  disableCheckbox = (dayIndex) => {
    // console.log("VSVDVDVD 1")

    // (startDate != null && endDate != null) ?
    //                 (startDate > endDate) ? true : false
    //                 :
    //                 true
    const { startDate, endDate } = this.props;

    if (startDate != null && endDate != null) {
      if (startDate > endDate) {
        // console.log("INVALID DATES, DISABLE!!!");
        return true;
      } else {
        
        // console.log(startDate, endDate);
        // console.log(dateDifference(endDate, startDate))
        let scheduledDays = dateDifference(endDate, startDate);
        // console.log(scheduledDays, " days");
        // sunday - 0, saturday - 6  
        if (scheduledDays < 7) {
          // console.log("< 7 DAYS")
          // console.log("DO THE CHECKS!!!!!")

          const date1 = new Date(startDate);
          // const date2 = new Date(endDate);
          let beginCount = false;
          let startDateDOWPOS = 0;
          let noDisableDays = [];

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
              // loops thru [sun, mon, tu, wed, th, fri, sat]
              for (let j = 0; j < DAYS_OF_WEEK.length; j++) {
                // if startDate == of one the day of weeks[]
                // start counting DoW from startDate by Saving first day
                if (DAYS_OF_WEEK[date1.getDay()] === DAYS_OF_WEEK[j]) {
                  beginCount = true;
                  startDateDOWPOS = j;
                  DOW[j] = j; 
                  // this.state.DOW.findIndex
                  // noDisableDays.push(j);
                } else {
                  DOW[j] = undefined;
                }
              }
            }
            // console.log(startDateDOWPOS, `startDateDOWPOS`)
            // if startDate DOW != to saturday. 
            if (DAYS_OF_WEEK[startDateDOWPOS] !== DAYS_OF_WEEK[DAYS_OF_WEEK.length - 1]) {
              // use ++startDateDOWPOS if ++ doesnt work.
              // console.log(startDateDOWPOS);
              startDateDOWPOS++; 
              DOW[startDateDOWPOS] = startDateDOWPOS;
              // noDisableDays.push(startDateDOWPOS++);
              // console.log("keep goin,", startDateDOWPOS);
            } else {
              // if does, start from sunday - friday 
              startDateDOWPOS = 0;
              DOW[startDateDOWPOS] = startDateDOWPOS;
              // noDisableDays.push(startDateDOWPOS++);
              // console.log("go back to beginning,", startDateDOWPOS);
            }
            
          }
          // console.log(DOW)

          // console.log(noDisableDays.sort((a, b) => a > b));
          // noDisableDays.sort((a, b) => a > b);
          // console.log(noDisableDays)
          // let checkThis = [];
          // for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
          //   console.log(`${DAYS_OF_WEEK[noDisableDays[i]]} === ${DAYS_OF_WEEK[i]}`)
          //   if (DAYS_OF_WEEK[noDisableDays[i]] === DAYS_OF_WEEK[i]) {
          //     checkThis.push(i);
          //   } else {
          //     checkThis.push(undefined);
          //   }
          // }
          // console.log(checkThis);
          // if (dayIndex != noDisableDays[noDisableDays.length - 1]) {
          //     return true;
          // } else {

          // }
          
          if (dayIndex === DOW[dayIndex]) {
            // console.log("go enable")
            // console.log(dayIndex, `-----------`, noDisableDays[dayIndex])
            return false;
          } else {
            // if (noDisableDays[dayIndex] === noDisableDays[noDisableDays.length - 1]) {
            //   return false;
            // }
            // console.log("go disable")
            // console.log(dayIndex, `-----------`, noDisableDays[dayIndex])
            return true;
          }
          
          // for (let i = 0; i < noDisableDays.length; i++) {
          //   // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
          //   if (dayIndex === noDisableDays[i]) {
          //     console.log("go disable")
          //     console.log(dayIndex, `-----------` ,noDisableDays[i])
          //     return false;
          //   } else {
          //     console.log("go enable")
          //     console.log(dayIndex, `-----------` ,noDisableDays[i])
          //     return true;
          //   }
          // }

          // console.log(date1.getDay(), `start date DoW`); 
          // console.log(date2.getDay(), `end date DoW`);
        } else {
          // Show all days, return false;
          // console.log("Enable checkbox")
          return false;
        }

      }
    } 
    else {
      // console.log("DATES ARE NOT PROVIDED, DISABLE!")
      return true;
    }
    // if (startDate && endDate) {
    // console.log(dateDifference(endDate, startDate));
    // }

    // if (dateDifference(endDate, startDate) >= 7) {
    //   this.setState({allDays: true})
    // }

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
    console.log(Array.from(this.state.selected), `gaa`)
    this.props.onSelect(Array.from(this.state.selected));
    this.onModalClose();
  };

  renderSelectedDays() {
    const selected = Array.from(this.state.selected);
    let sortedSelected = selected.sort((a, b) => a > b);
    // console.log(sortedSelected, `renderSelectedDays()`);
    return <Text>{sortedSelected.map((index) => DAYS_OF_WEEK_ABBREV[index]).join(', ')}</Text>;
  }
  
  render() {
    const { isModalOpen, selected, showPrompt } = this.state;
    const { startDate, endDate } = this.props;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={()=> {
          // this.disableCheckbox();
          this.onModalOpen();
        }}>
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
            {/*(startDate == null || endDate == null) && <Text style={{ color: 'red', fontWeight: 'bold' }}>Provide start and end dates</Text>*/}
            {(showPrompt.datesProvided == false) && <Text style={{ color: 'red', fontWeight: 'bold' }}>Provide start and end dates</Text>}
            {/* Show msg if dates are not valid. */}
            {/*(startDate != null && endDate != null) && (startDate > endDate) && <Text style={{ color: 'red', fontWeight: 'bold' }}>End date is not valid</Text>*/}
            {showPrompt.invalidDates && <Text style={{ color: 'red', fontWeight: 'bold' }}>End date is not valid</Text>}
            <View>
              {DAYS_OF_WEEK.map((day, index) => (
                <View key={day} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Turn off checkboxes if the start/end dates are not provided. */}
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
