import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import IconFont from 'react-native-vector-icons/MaterialCommunityIcons';

export const Icon = (props) => {
    const { iconName, text, onPress, isActive } = props;

    const { containerStyle, iconFontStyle, 
            yesActive, noActive, 
            notSureActive, textStyle,
            buttonStyle        
                } = styles;    

    const makeActiveStyle = () => {        
        if(isActive === 0 && text.toLowerCase() === 'no')
            return noActive;
        else if(isActive === 1 && text.toLowerCase() === 'yes')
            return yesActive;
        else if(isActive === 2 && text.includes('sure'))
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
        fontSize: 50,
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
        backgroundColor: 'rgb(35, 196, 83)',
        borderRadius: 25
    },
    noActive: {
        backgroundColor: 'rgb(252, 15, 27)',
        borderRadius: 25
    },
    notSureActive: {
        backgroundColor: 'rgb(134, 232, 217)',
        borderRadius: 25
    },
})

