import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Platform 
    } from 'react-native';

export const Header = () => {
    const { title } = props;
    return(
        <View
            style={styles.container}
        >
            <Text
                style={styles.title}
            >{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(136, 178, 239)',
        justifyContent: 'center',
        alignItems: 'center',
                height: 80,
        padding: 10,
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
    title: {
        fontSize: 40,
        fontWeight: '400',
        color: 'rgb(52, 57, 61)'
    }
});
