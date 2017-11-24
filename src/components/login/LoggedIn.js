import React, { Component } from 'react';
import { 
    View, 
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Platform
    } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class LoggedIn extends Component{
    
    animatedView = new Animated.Value(0);

    componentWillMount(){
        this.props.store.showLogo = true;
        this.props.store.showBackButton = false;
    }

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)
    }

    componentWillUnmount(){
        this.props.store.loginView.stopPing();
    }

    render(){
        const { loading, loginView : { userOnline, onOnlinePress } } = this.props.store;

        return(
            <Animated.View style={[{ flex: 1},  { opacity: this.animatedView }]}>
            <View 
                style={{ 
                    flex: 0.2, 
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    style={{ 
                        height: percentH(7), 
                        width: percentW(30), 
                        backgroundColor: 'rgb(95, 189, 103)', 
                        borderRadius: 5,                        
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={()=> {
                        this.props.store.showLogo = false;
                        this.props.store.history.push('/servicemenu')}}
                >
                    <Text
                        style={{ color: 'white', fontWeight: '500' }}
                    >Fake request</Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity
                    style={{ flex: 0.8}}
                    onPress={onOnlinePress}
                >
                    <View
                        style={[styles.container, loading && { alignItems: 'center' } ]}
                    >
                        {
                        loading ? 
                        <ActivityIndicator
                            size={Platform.OS === 'android' ? percentW(20) : 'large'}
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
            </Animated.View>
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