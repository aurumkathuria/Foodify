import * as React from 'react';
import { useState, useReducer, useEffect, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, Keyboard, Image, SafeAreaView, ScrollView } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Input, Button, P, Badge } from 'nachos-ui'
import { getGroceryList } from '../constants/Groceries'

import { CommonActions, NavigationRouteContext, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BUDGET = 50

function GroceryBadge(props) {
    let badgeStyleColor = styles.badgeRegular
    if (props.isKeeper) {
        badgeStyleColor = styles.badgeKeep
    }
    if (props.isRemove) {
        badgeStyleColor = styles.badgeRemove
    }
    return <TouchableOpacity onPress={props.onPress}><Badge value={props.text} style={{...styles.badge, ...badgeStyleColor, ...props.style}} textStyle={styles.badgeText} /></TouchableOpacity>
}
function GroceryItem(props) {
    return (
        <View style={styles.groceryContainer}>
                <View style={styles.groceryUpper}>
                    <View>
                        <Image style={styles.groceryPic} source={{uri: props.uri}}></Image>
                    </View>
                    <View>
                        <View>
                            <Text style={styles.groceryText}>{props.name}</Text>
                            <Text style={styles.groceryPrice}>{"$"}{props.price}</Text>
                        </View>
                        
                    </View>
                </View>
                <View style={styles.groceryLower}>
                    {/* <GroceryBadge text={"New!"} style={{backgroundColor: "#78BC61"}}/> */}
                    <GroceryBadge text={"Keep"} onPress={props.flipKeep} isKeeper={props.isKeeper}/>
                    <GroceryBadge text={"Remove"} onPress={props.flipRemove} isRemove={props.isRemove} />
                    <GroceryBadge text={"More"} />
                </View>
        </View>
    )
}
function generateList(oldList, keeperMap, removeMap) {
    const keepers = oldList.filter(item => keeperMap[item.uri] || false)
    const keeperCost = keepers.reduce((acc, item) => acc + item.price, 0)

    const removers = oldList.filter(item => removeMap[item.uri] || false)

    const keeperUris = keepers.map(item => item.uri)
    const removeUris = removers.map(item => item.uri)

    const { groceryList: newGroceryList, totalPrice} = getGroceryList(BUDGET - keeperCost, keeperUris.concat(removeUris))

    let newKeeperMap = {}
    newGroceryList.forEach(item => newKeeperMap[item.uri] = false)
    
    newKeeperMap = {...newKeeperMap, ...keeperMap}

    let newRemoveMap = {}
    newGroceryList.forEach(item => newRemoveMap[item.uri] = false)
    newRemoveMap = {...newRemoveMap, ...removeMap}

    
    return {
        newKeeperMap,
        newRemoveMap,
        newGroceryList: keepers.concat(newGroceryList),
        totalPrice
    }

}

function reducer(state, action) {
    let oldMap = null
    let uri = null
    switch (action.type) {
        
        case 'newList':
            const { newGroceryList, newKeeperMap, newRemoveMap, totalPrice } = generateList(state.groceryList, state.keeperMap, state.removeMap)

            return {
                ...state,
                firstListGenerated: true,
                groceryList: newGroceryList,
                keeperMap: newKeeperMap,
                totalPrice

            }
        case 'flipKeep':
            oldMap = state.keeperMap
            uri = action.payload
            return {
                ...state,
                keeperMap: {
                    ...oldMap,
                    [uri]: !oldMap[uri]
                }
            }
        case 'flipRemove':
            oldMap = state.removeMap
            uri = action.payload
            return {
                ...state,
                removeMap: {
                    ...oldMap,
                    [uri]: !oldMap[uri]
                }
            }
        case 'loadList':
            console.log('loading list! with', action.payload[0])
            return {
                ...state,
                groceryList: action.payload
            }

    }
}
const initialState = {groceryList: [], keeperMap: {}, removeMap:{}}
export default function GroceryScreen(props) {
    const [state, dispatch] = useReducer(reducer, initialState)

    // useIsFocused(
    //     useCallBack(() => {
    //         return ()
    //     })
    // )
    // console.log(global.list)
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            console.log('focusing!')
            let jsonValue = await AsyncStorage.getItem('@active_list')
            jsonValue  = jsonValue != null ? JSON.parse(jsonValue) : {activeList: []};
            if (jsonValue.activeList.length) {
                console.log('found lst with items: ', jsonValue.activeList.length)
                // dispatch({action: 'loadList', payload: jsonValue.activeList})
                // await AsyncStorage.setItem('@active_list', JSON.stringify({activeList: []}))

    
            } 
        })
    
        return unsubscribe;
      }, [props.navigation, state.groceryList])

    // if (props.route) {
    //     console.log('LST???', props.route.params.groceryList.length)
    // }
    // useEffect(() => {
    //     console.log('checking')
        
    // })

    async function saveCart() {
        let savedLists = []
        try {
            let jsonValue = await AsyncStorage.getItem('@saved_lists')
            jsonValue  = jsonValue != null ? JSON.parse(jsonValue) : {savedLists: []};
            savedLists = jsonValue.savedLists
          } catch(e) {
            // error reading value
            throw e
          }
        
        try {
            savedLists.push(state.groceryList)
            const jsonValue = JSON.stringify({
                savedLists: savedLists
            })
            await AsyncStorage.setItem('@saved_lists', jsonValue)
        } catch (e) {
        // saving error
        }
        console.log("Saved!")
    }
    function flipKeepForItem(item) {
        console.log('flipping keep: ', item.name, ' to: ', !state.keeperMap[item.uri])
        dispatch({type: 'flipKeep', payload: item.uri})
        // setKeepState({
        //     ...keepState,
        //     [item.uri]: !keepState[item.uri]
        // })
    }
    function flipRemoveForItem(item) {
        console.log('flipping remove: ', item.name, ' to: ', !state.removeMap[item.uri])
        dispatch({type: 'flipRemove', payload: item.uri})

    }
    // console.log('keeeeep', state.keeperMap)
    const groceryItems = state.groceryList.map((item, i) =>
        <View key={item.uri}>
            <GroceryItem 
                name={item.name}
                price={item.price}
                uri={item.uri}
                flipKeep=   {() => flipKeepForItem(item)}
                flipRemove= {()=> flipRemoveForItem(item)}
                isKeeper={state.keeperMap[item.uri] || false}
                isRemove={state.removeMap[item.uri] || false}
                
            />
        </View>
    )
  
    return (
        <View style={styles.container}>
            <Grid>
                <Col style={styles.leftStyle} size={1}>
                    <Row style={styles.section}>
                        <View style={styles.lstContainer}>
                                <ScrollView>
                                    {
                                        groceryItems && groceryItems.length ? 
                                        groceryItems: 
                                        <Text>Click generate to create a grocery list</Text>
                                    }
                                </ScrollView>
                        </View>
                        
                        
                    </Row>
                </Col>
              
            </Grid>
            <View style={styles.btnContainer}>
                <Button style={styles.generateBtn} textStyle={styles.generateBtnText} onPress={()=>dispatch({type: 'newList'})}>Generate</Button>
            </View>
            <View style={styles.likeContainer}>
                <Button style={styles.likeBtn} textStyle={styles.likeBtnText} iconSize={16} onPress={saveCart}>Save Cart</Button>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilePic: {
        width: 66,
        height: 66,
    },
    leftStyle: {
        padding: 10
    },
    rightStyle: {
        padding: 10
    },
    personalInfo: {
        flexDirection: "column"
    },
    nutritionalInfo: {
        flexDirection: "column"
    },
    groceryUpper: {
        flexDirection: "row",
        alignItems: "center"

    },
    groceryPic: {
        width: 56,
        height: 56,
        marginRight: 8
    },
    groceryText: {
        fontSize: 15
    },
    groceryPrice: {
        fontSize: 11
    },
    groceryLower: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8
    },
    badge: {
        width: 56,
        height: 20,
        marginRight: 8,
        display: "flex",
        justifyContent: "center"
    },
    badgeRegular: {
        backgroundColor: "#FF9B71"
    },
    badgeKeep: {
        backgroundColor: "#78BC61"
    },
    badgeRemove: {
        backgroundColor: "#EE4266"
    },
    badgeText: {
        fontSize: 9
    },
    section: {
        flexDirection: "column"
    },
    groceryContainer: {
        width: 250,
        marginTop: 16
    },
    btnContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        marginBottom: 8,
        marginRight: 8
    },
    generateBtn: {
        backgroundColor: "#63B4D1",
    },
    generateBtnText: {
        color: "#454545"
    },
    likeContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        marginBottom: 8,
        marginLeft: 8
    },
    likeBtn: {
        backgroundColor: "#78BC61"
    },
    likeBtnText: {
        color: "#d5d5d5"
    },
    lstContainer: {
        flex: 1,
        marginBottom: 48
    }
});