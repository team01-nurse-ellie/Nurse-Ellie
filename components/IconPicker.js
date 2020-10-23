import React from 'react';
import { Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import MedIconIndex from '../components/MedicationImages';

class Component extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: props.selected,
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
        const { current, isModalOpen, selected } = this.state;
        return (
            <React.Fragment>
                <TouchableWithoutFeedback onPress={this.onModalOpen} >
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
                                <TouchableOpacity key={key} onPress={()=> this.onIconPress(Number(key))} style={styles.medicationIcon}>
                                    {MedIconIndex.index[key]}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={this.onModalClose}>
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
        paddingHorizontal: 50
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