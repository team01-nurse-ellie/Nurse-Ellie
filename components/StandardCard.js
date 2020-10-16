import React from 'react';
import { StyleSheet, View } from 'react-native';

const StandardCard = (props) => {
    return (
      <View style={ styles.card }>
        <View style={ styles.cardContent }>
        { props.children }
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10, 
    elevation: 3, 
    backgroundColor: '#FFF', 
    shadowOffset: { width: 1, height: 1}, 
    shadowColor: '#333', 
    shadowOpacity: 0.3, 
    shadowRadius: 2, 
    marginHorizontal: 4, 
    marginVertical: 6, 
    paddingVertical: 3
  }, 
  cardContent: {
    marginHorizontal: 18, 
    marginVertical: 10, 
  }
})

export default StandardCard;