import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, Keyboard } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
// @ts-ignore
import { Input, Button, Checkbox, P } from 'nachos-ui'
import { CommonActions } from '@react-navigation/native';

function onBtnPress(navigation) {
    navigation.navigate('Grocery List')
}
export default function TabOneScreen({ navigation }) {
    const [budget, setBudget] = useState("")
    const [groceryList, setGroceryList] = useState([])

    return (
        <View style={styles.container}>
            <Text onPress={() => Keyboard.dismiss()} style={styles.header}>Enter Budget: </Text>
            <Input
                placeholder='Enter Budget Here'
                placeholderTextColor="black" 
                style={styles.budgetInput}
                keyboardType='numeric'
                value={budget.toString()}
                onChangeText={setBudget}
            />
            <Button style={styles.btn} onPress={() => onBtnPress(navigation)}>Get Grocery List</Button>

        </View>
    );
}

const styles = StyleSheet.create({
  budgetInput: {
      margin: 36,
  },
  header: {
      fontSize: 24,
      marginTop: 36
  },
  btn: {
    flex: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 48,
    marginTop: 24
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
