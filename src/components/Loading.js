import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { PulseLoader } from 'react-native-indicator';

export class Loading extends Component {
    render(){
        return(
            <View
                style={{ 
                    flex: 1, 
                    backgroundColor: 'rgb(25, 58, 101)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                    <StatusBar 
                        backgroundColor='rgb(25, 58, 101)'
                        barStyle="light-content"
                    />
                    <PulseLoader 
                        color='rgb(255, 255, 255)'
                        size={60}
                    />                
            </View>
        );
    }
}


