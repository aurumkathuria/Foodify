import * as React from 'react';
import { useState , useEffect} from 'react'

import { StyleSheet, Keyboard, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { Checkbox, P } from 'nachos-ui'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function TabTwoScreen(props) {
    const [savedLists, setSavedLists] = useState([])

    // useEffect(() => {
    //     if (savedLists.length == 0) {
    //         getSavedLists()
    //     }
       
    // })
    const getSavedLists = async () => {
        try {
            let jsonValue = await AsyncStorage.getItem('@saved_lists')
            // console.log("saved lists: ")
            jsonValue = jsonValue != null ? JSON.parse(jsonValue) : []
    
            setSavedLists(jsonValue.savedLists)
          } catch(e) {
            // error reading value
          }
    }
    getSavedLists()
    const yoplaitUri = "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSa_8dWvKnn7R1cAVazoNrzqgnVyWMN4ZFjXIzVSb4_yQIzn6JnMxR_ddsEoHtMTEjKR-6B-XMTGvmhmyzhsB8tBy34410pVyxeGXmstulwhYJyAA&usqp=CAE"

    async function loadList(groceryList) {
        console.log('setting list', groceryList[0])
        // props.navigation.setParams({ groceryList })
        // console.log('setting!')
        const jsonValue = JSON.stringify({
            activeList: groceryList
        })
        await AsyncStorage.setItem('@active_list', jsonValue)
        props.navigation.navigate('GroceryScreen')
    }
    const listItems = savedLists.map((list, i) =>
        <TouchableOpacity onPress={() => loadList(list)}>
            <View style={styles.groceryItemContainer} key={i}>
                <View style={styles.upper}>
                    <Text>Grocery List {i+1}</Text>
                </View>
                <View style={styles.lower}>
                    { 
                        list.map((item, i) =>
                            <Image style={styles.groceryPic} source={{uri: item.uri}}></Image>
                        )   
                    }
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{'Saved Lists'}</Text>
            <View style={styles.lstContainer}>
                {listItems}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lstContainer: {
      marginTop: 26,
      flex: 1,
      alignItems: "flex-start",
  },
  priceTxt: {
      marginBottom: 25
  },
  header: {
      fontSize: 24,
      marginTop: 24
  },
  groceryItemContainer: {
      alignItems: 'flex-start',
      justifyContent: "flex-start",
      padding: 12
  },
  groceryName: {
      color: 'white',
      marginLeft: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  groceryPic: {
    width: 24,
    height: 24,
    marginRight: 4
    },
    upper: {
        marginBottom: 8
    },
    lower: {
        flexDirection: "row"
    },
});
