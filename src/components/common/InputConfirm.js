import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Button } from './Button';

export const InputConfirm = ({text, onPressYes, onPressNo, disabled}) => {        

    return(
        <View style={styles.containerStyleMain} > 
            <View style={styles.labelContainerStyle}  >
                <Text style={styles.labelTextStyle} >{text}</Text>
            </View>

            <View style={ !disabled && { opacity: 0}} >
                <Button 
                    key={1} 
                    label='Yes'
                    onPress={onPressYes}
                    disabled={disabled}
                    containerStyle={styles.buttonContainerStyle}
                    textStyle={{color: 'rgb(249, 249, 249)'}}
                    />
                <Button 
                    key={2} 
                    label='No' 
                    onPress={onPressNo}
                    disabled={disabled}
                    containerStyle={[styles.buttonContainerStyle, {backgroundColor: 'rgb(196, 47, 21)'}]}
                    textStyle={{color: 'rgb(249, 249, 249)'}}
                    />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyleMain:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(227, 233, 244)',
        marginVertical: 10,
        marginHorizontal: 10,
        elevation: 3
    },

    buttonContainerStyle:{
        height: 40,
        width: 100,
        backgroundColor: 'rgb(52, 165, 14)',
        margin: 10,
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
    labelContainerStyle: {
        marginLeft: 10,        
        flex: 1
    },
    labelTextStyle:{
        fontSize: 18
    }    
});