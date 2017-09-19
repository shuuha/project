import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';

export const Header = (props) => {
    const { header, onForwarPress, onPress, disabled, style } = props;    

    const renderBackBtn = () =>{           // empty space in the text for layout purposes
        return(
            <View  >
                <TouchableWithoutFeedback
                    disabled={disabled}
                    style={[style, {flex: 1}]}
                    onPress={onPress}
                    >
                    <View>
                        <Text style={[styles.buttonTextStyle, disabled && styles.buttonDisabled ]} 
                            >{'< back'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    const renderForwardBtn = () =>{            
        return(
            <View  >
                <TouchableWithoutFeedback
                    disabled={true}
                    style={{ flex: 1}}
                    >
                    <View>
                        <Text style={styles.buttonDisabled}>{'< back'}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    const renderTitle = () => {
        return(
                <View   >
                    <Text style={styles.titleStyle}> {header} </Text>
                </View>                
        );
    }

    return(    
            <View style={styles.containerStyle} >
                {renderBackBtn()}
                {renderTitle()}
                {renderForwardBtn()}
            </View>
        );    
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',   
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(210, 221, 239)',
        height: 50,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3},
                shadowOpacity: 0.3
            },
            android: {
                elevation: 3
            }
        })        
    },    
    titleStyle: {        
        fontSize: 25,
        fontWeight: '500',        
    },    
    buttonTextStyle: {
        fontSize: 25,
        fontWeight: '500',
        marginHorizontal: 10,
        color: 'rgb(85, 143, 237)'
    },
    buttonDisabled: {
        opacity: 0,
        fontSize: 25,
        fontWeight: '500',
        marginHorizontal: 10,
        color: 'rgb(85, 143, 237)'
    }
});