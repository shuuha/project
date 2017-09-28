import React, { Component } from 'react';
import {View, 
        Text, 
        TouchableOpacity, 
        StyleSheet, 
        Platform,
        Dimensions 
    } from 'react-native';

import { Icon } from './Icon';

const { width } = Dimensions.get('window');

export const InputQ = ({text, onPress, isActive}) => {

    return(
        <View style={styles.containerStyleMain} > 
            <View style={styles.textContainerStyle}  >
                <Text style={styles.textStyle} >{text}</Text>
            </View>

            <View style={styles.iconsContainerStyle} >
                <Icon    
                    id={1}                
                    onPress={()=> onPress(1)}                       // 1 because 1 is used to mean true
                    iconName='checkbox-marked-circle-outline'
                    text='Yes'
                    isActive={isActive}

                />
                <Icon
                    id={0}         
                    onPress={()=> onPress(0)}                       // 0 used to mean false
                    iconName='close-circle-outline'
                    text='No'
                    isActive={isActive}
                    
                    />
{/*                <Icon                    
                    onPress={()=> onPress(2)}
                    iconName='help-circle-outline'
                    text='Not sure'
                    isActive={isActive}
                    />*/}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyleMain:{
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'space-around',        
        margin: 25,        
        borderColor: 'rgb(43, 45, 45)',        
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
    },
    textStyle:{        
        marginVertical: 30,
        marginHorizontal: 10,
        fontSize: 28,
        textAlign: 'center',
        color: 'rgb(230, 236, 239)',
        

    },    
    iconsContainerStyle:{
        width: width - 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',        
        marginVertical: 20,
        paddingHorizontal: 10,     
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