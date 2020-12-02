import React from 'react';
import { StyleSheet, View } from 'react-native';

const CondensedMedCard = (props) => {
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
    paddingVertical: 3,
    flex: 1, 
    // width: 120, 
    // height: 155, 
  }, 
  cardContent: {
    flex:1,
    marginHorizontal: 8, 
    marginVertical: 1, 
    alignItems: 'center', 
  }
})

export default CondensedMedCard;