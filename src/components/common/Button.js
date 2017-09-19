import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';

export const Button = ({label, onPress, disabled, containerStyle, textStyle}) => {
    
    const { containerStyleMain, buttonStyle, textStyleMain, buttonDisabled } = styles;

    return(
        <View style={[containerStyleMain, containerStyle]} >
            <TouchableOpacity
                    disabled={disabled}
                    style={[buttonStyle, disabled && buttonDisabled]}
                    onPress={onPress}
                    >
                <Text style={[textStyleMain, textStyle]}>{label} </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyleMain: {
        height: 50,
        width: 300,
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: 'rgb(66, 134, 244)',
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3
            },
            android: {
                elevation: 3
            }
        })
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyleMain: {
        fontSize: 20,
        fontWeight: '500'
    },
    buttonDisabled: {
        backgroundColor: 'rgb(164, 168, 173)',
        borderRadius: 5,
        elevation: 3
    }
});
