import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const Input = (props) => {
        const { value, 
                label, 
                placeholder, 
                autoCorrect, 
                editable, 
                maxLength, 
                onChangeText,
                placeholderTextColor,
                secureTextEntry, 
                style,
                onSubmitEditing,
                autoCapitalize
            } = props;
        

    return(
        <View style={styles.containerStyle} >      
            <TextInput
                style={[styles.inputStyle, style]}
                value={value}
                placeholder={placeholder}
                autoCorrect={autoCorrect || true}
                editable={editable || true }
                maxLength={maxLength}
                onChangeText={onChangeText}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                // multiline={true}
                numberOfLines={3}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholderTextColor='rgb(194, 196, 198)'
                onSubmitEditing={onSubmitEditing}
                autoCapitalize={autoCapitalize}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',                
        alignItems: 'center',
        justifyContent: 'center',        
        marginHorizontal: 50,        
        marginBottom: -5,        
    },
    inputStyle: {
        flex: 1,
        fontSize: 22,
        textAlign: 'center',
    }
})