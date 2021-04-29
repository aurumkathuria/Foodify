import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, Keyboard, Image} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { Input, Button, P } from 'nachos-ui'


import { CommonActions } from '@react-navigation/native';
export default function ProfileScreen() {

    return (
        <View style={styles.container}>
            <Grid>
                <Col style={styles.leftStyle} size={1}>
                    <Image 
                        source={{
                            uri: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                        }}
                        style={styles.profilePic}
                    />
                    <Text style={styles.profileName}>Calvin Grewal</Text>
                </Col>
                <Col style={styles.rightStyle} size={1}>
                    <Row style={styles.personalInfo}>
                        <Text style={styles.headerText}>Personal Info:</Text>
                        <Text>Age: 20</Text>
                        <Text>Budget: $200</Text>
                    </Row>
                    <Row style={styles.nutritionalInfo}>
                        <Text style={styles.headerText}>Nutritional Info:</Text>
                        <Text>Allergies/Dislikes: None</Text>
                        <Text>Nutritional Prefs: None</Text>
                        <Text>Other Notes : None</Text>

                    </Row>
                </Col>
            </Grid>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    profileName: {
        marginTop: 12
    },
    headerText: {
        fontSize: 24,
        marginBottom: 12
    }

});