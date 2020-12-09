import React from 'react';
import { Easing, StyleSheet, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import MedIconIndex from '../components/MedicationImages';

class Component extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: '1',
            isModalOpen: false,
        };
    }

    onIconPress = (medKey) => {
        this.setState({ selected: medKey });
    };

    onSelect = () => {
        this.props.onSelect(this.state.selected);
        this.onModalClose();
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

    render(){
        const { isModalOpen, selected } = this.state;
        return (
            <React.Fragment>
                <TouchableWithoutFeedback disabled={this.props.hasOwnProperty("disabled") ? true : false} onPress={this.onModalOpen} >
                    {selected ? MedIconIndex.index[this.props.selected] : MedIconIndex.index[1]}
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
                        <Text style={styles.headerText}> Select a Medication Icon </Text>
                        <View style={styles.iconContainer}>
                            {Object.keys(MedIconIndex.index).map((key) => (
                                <TouchableOpacity key={key} onPress={()=> this.onIconPress(key)} style={styles.medicationIcon}>
                                    {MedIconIndex.index[key]}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={this.onSelect}>
                                <Text> Select </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </React.Fragment>
        )
    }
}

Component.propTypes = {
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

var screenHeight = Dimensions.get("window").height;
var screenWidth = Dimensions.get("window").width;

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
        width: screenWidth * 0.75
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        borderRadius: 15
    },
    medicationIcon: {
        alignItems: 'center',
        height: 100,
        justifyContent: 'center',
        width: '33%',
    },
    headerText: {
        color: '#000000',
        fontFamily: 'roboto-regular',
        fontSize: 20,
    }
});

export default Component;