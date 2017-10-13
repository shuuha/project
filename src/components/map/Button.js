import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform 
    } from 'react-native';

export const Button = ({ onPress, label}) => {

    const hitSlop = {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
    }

    return(
        <TouchableOpacity
            hitSlop = {hitSlop}
            activeOpacity={0.7}
            style={styles.mapButton}
            onPress={onPress}
        >
            <Text style={styles.buttonTextStyle}>
                { label }
            </Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    mapButton: {
        width: 75,
        height: 75,
        borderRadius: 85/2,
        backgroundColor: 'rgba(252, 253, 253, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
        ios: {
            shadowColor: 'black',
            shadowRadius: 8,
            shadowOpacity: 0.12,
        },
        android: {
            elevation: 3
            }
        }),
    opacity: .6,
    zIndex: 10,
    },

    buttonTextStyle: {
        fontWeight: 'bold', 
        color: 'black',
        textAlign: 'center'
   }
})