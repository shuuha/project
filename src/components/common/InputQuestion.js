import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { Icon } from './Icon';

export const InputQuestion = ({text, onPress, isActive}) => {

    return(
        <View style={styles.containerStyleMain} > 
            <View style={styles.textContainerStyle}  >
                <Text style={styles.textStyle} >{text}</Text>
            </View>

            <View style={styles.iconsContainerStyle} >
                <Icon                    
                    onPress={()=> onPress(1)}                       // 1 because 1 is used to mean true
                    iconName='checkbox-marked-circle-outline'
                    text='Yes'
                    isActive={isActive}

                />
                <Icon                    
                    onPress={()=> onPress(0)}                       // 0 used to mean false
                    iconName='close-circle-outline'
                    text='No'
                    isActive={isActive}
                    
                    />
                <Icon                    
                    onPress={()=> onPress(2)}
                    iconName='help-circle-outline'
                    text='Not sure'
                    isActive={isActive}
                    />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyleMain:{        
        alignItems: 'center',
        justifyContent: 'space-around',        
        margin: 25,
        borderColor: 'rgb(43, 45, 45)',
        // borderWidth: 1,
        borderRadius: 5,        
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3
            },
            android: {
                elevation: 2
            }
        })
    },
    textContainerStyle: { 
        flexDirection: 'row',        
        backgroundColor: 'rgb(87, 178, 224)',
        borderRadius: 3,
        padding: 5        

    },
    textStyle:{
        flex: 1,
        fontSize: 28,
        textAlign: 'center',
        color: 'rgb(230, 236, 239)',

    },    
    iconsContainerStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        
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
});