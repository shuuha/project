import React, { Component } from 'react';
import { 
    View, 
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
    } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class LoggedIn extends Component{
    
    componentWillUnmount(){
        this.props.store.loginView.stopPing();
    }

    render(){
        const { loading, loginView : { userOnline, onOnlinePress } } = this.props.store;

        return(
            <TouchableOpacity
                style={{ flex: 1}}
                onPress={onOnlinePress}
            >
                <View
                    style={[styles.container, loading && { alignItems: 'center' } ]}
                >
                    {
                    loading ? 
                    <ActivityIndicator
                        size={percentW(20)}
                        color='rgb(255, 255, 255)'
                    />
                    :
                    <Icon 
                        name='check-circle-outline'
                        style={[styles.icon, userOnline && { color:'rgb(94, 189, 100)' } ]}
                    />
                    }

                </View>
            </TouchableOpacity>
        );
    }
}

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
}

const percentW = (num) => {
    return (width / 100) * num;
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    icon: {
        fontSize: percentW(65),
        color: 'rgb(255, 255, 255)',
        marginBottom: percentH(15)
    }
})