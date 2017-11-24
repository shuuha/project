import React, { Component } from 'react';
import { 
    View,
    Text,
    Dimensions, 
    StyleSheet, 
    Animated,
    Image,
    TextInput,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,
    PixelRatio,
    Platform
    } from 'react-native';
import { observer, inject } from 'mobx-react'; 
import { images } from './assets';

@inject('store')
@observer
export class PassRecovery extends Component{
    state = {
        top: percentH(10)
    }

    animatedView = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)
    }
    
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);        
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();        
    }

    _keyboardDidShow = (e) => {
    // pushing the view up, the overall distance is calculated from : 
    // currentMarginTop - keyboardHeight + percent of (text + user field + login button)
    this.setState({ top: this.state.top - e.endCoordinates.height + percentH(28)})
    }

    _keyboardDidHide = () => {
        this.setState({ top: percentH(10)})
    }


    render(){
        const { passRecovery : store, loading } = this.props.store;
        return(
            <Animated.View style={[
                    styles.container, 
                    { opacity: this.animatedView }, 
                    { marginTop: this.state.top }
                ]} 
            >

                <Text
                    style={styles.text}
                >To reset your password, please enter your email address</Text> 

                <View style={[styles.email]} >
                    <Image 
                        style={styles.icon}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        editable={!loading}
                        autoCorrect={false}
                        value={store.value}
                        onChangeText={store.onChangeText} 
                        returnKeyType='send'
                        onSubmitEditing={store.onSubmitPass}
                        placeholder='email@email.com'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent'
                        style={[styles.emailText, store.value && { fontWeight: '500' }]}
                        placeholderTextColor='rgb(206, 206, 206)'
                    />
                </View>
                <View style={styles.sendButton} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={store.onSendPress}
                        disabled={loading}
                    >
                    {
                        loading ?
                        <AcitivityIndicator
                            size={percentH(6)}
                            color='rgb(255, 255, 255)'
                        />
                        :
                        <Text
                            style={{ 
                                color: 'rgb(255, 255, 255)', 
                                fontSize: percentW(5), 
                                fontWeight: '500'
                            }}
                        >Send</Text>
                    }
                    </TouchableOpacity>
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
    container: {        
        height: percentH(45),
        width: percentW(64),
        alignSelf: 'center',
        marginTop: percentH(10),
    },
    icon: {
        ...Platform.select({
            ios: {
                height: PixelRatio.getPixelSizeForLayoutSize(8),
                width: PixelRatio.getPixelSizeForLayoutSize(8),
                marginRight: percentW(2)
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(6),
                width: PixelRatio.getPixelSizeForLayoutSize(6)
            }
        }),
        marginRight: percentW(1)
    },
    email : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'        
    },
    emailText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(5), 
        /*fontWeight: '500'*/
    },
    text: {
        alignSelf: 'center',
        width: percentW(64),
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: percentW(5), 
        fontWeight: '500',
        marginBottom: percentH(2.5)
    },
    sendButton: {
        height: percentH(5.5),
        width: percentW(64),        
        borderRadius: 5,
        marginBottom: percentH(1.5),
        marginTop: percentH(1.5),
        backgroundColor: 'rgb(95, 188, 102)',
        
    },
})
