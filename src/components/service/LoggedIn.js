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
    state = {
        buttonSize: {}
    }

    componentWillMount(){
        this.props.store.appStore.showLogo = true;
        this.props.store.appStore.showBackButton = false;
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
        this.props.store.loggedIn.stopPing();
    }

    setButtonRadius = () => {
        const { height, width } = this.state.buttonSize;
        const buttonRadius = (height + width) / 2;        
        return buttonRadius;
    }

    render(){        
        const { 
            appStore: { loading, user, requestAvailable }, 
            loggedIn : { onTestButtonPress, onOnlinePress, clearToken } 
        } = this.props.store;

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
                        backgroundColor: requestAvailable ? 'rgb(95, 189, 103)' : 'rgb(158, 158, 158)', 
                        borderRadius: 5,                        
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    disabled={!requestAvailable}
                    onPress={ onTestButtonPress }
                >
                    <Text
                        style={{ color: 'white', fontWeight: '500' }}
                    >Accept request</Text>
                </TouchableOpacity>
            </View>
                    <View
                        style={{ 
                            flex: 0.8, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            paddingBottom: percentH(15),
                        }}
                    >                    
                    {
                        loading 
                        ? 
                        <ActivityIndicator
                            size={ Platform.OS === 'android' ? 60 : 'large' }
                        />
                        :
                        <TouchableOpacity
                            onPress={onOnlinePress}
                            style={{ borderRadius: this.setButtonRadius() }}
                            onLayout={e => this.setState({ buttonSize: e.nativeEvent.layout })}
                        >
                                <Icon 
                                    name='check-circle-outline'
                                    style={[styles.icon, user.online && { color:'rgb(94, 189, 100)' } ]}
                                />
                        </TouchableOpacity>
                    }
                    </View>
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
        // marginBottom: percentH(15)
    }
})