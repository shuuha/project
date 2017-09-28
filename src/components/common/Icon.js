import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import IconFont from 'react-native-vector-icons/MaterialCommunityIcons';

export const Icon = (props) => {

    const { 
            iconName, 
            text, 
            onPress, 
            isActive, 
            id
        } = props;

    const { 
            containerStyle, 
            iconFontStyle, 
            yesActive, 
            noActive, 
            notSureActive, 
            textStyle,
            buttonStyle        
        } = styles;    

    const makeActiveStyle = () => {        
        if(isActive == 0 && id == 0)
            return noActive;
        else if(isActive == 1 && id == 1)
            return yesActive;
        else if(isActive == 2 && id == 2)
            return notSureActive;            
    };

    return(
        <View style={containerStyle} >
            <TouchableOpacity
                style={buttonStyle}
                onPress={onPress}
                >
                <View  >
                    <IconFont
                        id={id}
                        name={iconName} 
                        style={[iconFontStyle, makeActiveStyle()]}
                        />
                </View>

                <Text style={textStyle} >{text}</Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    containerStyle:{
        height: 100,
        width: 100,
    },
    iconFontStyle:{
        fontSize: 40,
        color: 'rgb(43, 45, 45)'
    },
    textStyle: {
        fontSize: 22,
        color: 'rgb(43, 45, 45)'
    },
    buttonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    yesActive: {
        backgroundColor: 'rgb(131, 247, 164)',
        borderRadius: 25
    },
    noActive: {
        backgroundColor: 'rgb(214, 119, 119)',
        borderRadius: 25
    },
    notSureActive: {
        backgroundColor: 'rgb(149, 216, 212)',
        borderRadius: 25
    },
})

