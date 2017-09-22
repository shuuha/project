import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';

export const Button = (props) => {
            const { label, 
                    onPress, 
                    disabled, 
                    containerStyle, 
                    textStyle
                } = props;

    return(
        <View style={[styles.containerStyleMain, containerStyle]} >
            <TouchableOpacity
                    disabled={disabled}
                    style={[styles.buttonStyle, disabled && styles.buttonDisabled]}
                    onPress={onPress}
                    >
                <Text style={[styles.textStyleMain, textStyle]}>{label} </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyleMain: {
        height: 50,
        width: 300,
        borderRadius: 5,
        marginVertical: 50,
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
        fontSize: 25,
        fontWeight: '500',
        color: 'rgb(228, 241, 254)'
    },
    buttonDisabled: {
        backgroundColor: 'rgb(164, 168, 173)',
        borderRadius: 5,
        elevation: 3
    }
});
