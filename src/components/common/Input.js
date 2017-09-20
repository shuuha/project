import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const Input = (props) => {
        const { value, label, placeholder, autoCorrect, 
                editable, maxLength, onChangeText,
                placeholderTextColor,
                secureTextEntry, style
                } = props;
                
        const { containerStyle, labelStyle, inputStyle } = styles;

    return(
        <View style={containerStyle} >
            {/*<Text style={labelStyle} >{label}</Text>*/}
            <TextInput
                style={[inputStyle, style]}
                value={value}
                placeholder={placeholder}
                autoCorrect={autoCorrect || true}
                editable={editable || true }
                maxLength={maxLength}
                onChangeText={onChangeText}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                
                />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30
    },
    labelStyle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '500'
    },
    inputStyle: {
        flex: 2,
        fontSize: 22
    }
})