import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import MapView  from 'react-native-maps';

export class Map extends Component {
    render(){
        return(
            <MapView 
                initialRegion={{
                    latitude: 50,
                    longitude: 50,
                    latitudeDelta: 0.092,
                    longitudeDelta: 0.0421
                }}
            />
        );
    }
}