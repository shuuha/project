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
    PixelRatio,
    Vibration,
    Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { images } from './assets';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class SignUp extends Component{

    state = {
        top: percentH(10),
        newTop: null
    }

    animatedView = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)

        this.props.store.signUp.refs = this.refs;
        this.props.store.signUp.Vibration = Vibration;
        this.props.store.signUp.Keyboard = Keyboard;
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);        
    }    

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        Keyboard.dismiss();
    }    

    _keyboardDidShow = (e) => {
    // pushing the view up, the overall distance is calculated from : 
    // currentMarginTop - keyboardHeight + percent of (text + user field + login button)
    this.setState({ newTop: this.state.top - e.endCoordinates.height + percentH(27)});
    this.props.store.errorText = null;
    }

    _keyboardDidHide = () => {
        this.setState({ newTop: null})
    }

    render(){
        const { signUp : store, loading, errorText } = this.props.store;
        return(            
            <Animated.View style={[
                    styles.container, 
                    { opacity: this.animatedView }, 
                    this.state.newTop && { marginTop: this.state.newTop }
                ]} 
            >

                <Text
                    style={styles.text}
                >{ errorText ? " " : 'Enter your phone number'}</Text>

                <Animatable.View style={[styles.fullname]}
                    animation={store.fullnameError && store.shakeTrigger ? 'shake' : ''}
                    duration={500}
                    useNativeDrive={true}
                    onAnimationEnd={()=> store.shakeTrigger = false}
                >
                    <Image 
                        style={styles.fullnameImage}
                        source={images['man']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        editable={!loading}
                        ref={'inputFullname'}
                        value={store.fullname}
                        onChangeText={store.onChangeName}
                        placeholder='Fullname'
                        placeholderTextColor='rgb(206, 206, 206)'
                        autoCapitalize='words'
                        autoCorrect={false}
                        returnKeyType='next'
                        onFocus={store.onFullnameFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={()=>store.onNameSubmitPress(this.refs)}
                        underlineColorAndroid='transparent'
                        style={[styles.fullnameText, store.fullnameError && styles.errorText]}
                    />
                </Animatable.View>
                <View
                    style={{ flexDirection: 'row' }}
                >
                    <Animatable.View 
                        style={[styles.phone, { width: percentW(23) }]}            // first input on the phone's row

                        animation={store.codeValueError && store.shakeTrigger ? 'shake' : ''}
                        duration={500}
                        useNativeDrive={true}
                        onAnimationEnd={()=> store.shakeTrigger = false}
                    >
                        <Image 
                            style={styles.phoneImage}
                            source={images['phone']}
                            resizeMode='contain'
                        />
                        <TextInput 
                            editable={!loading}
                            ref={'inputCodeValue'}
                            value={store.codeValue}
                            onChangeText={store.onChangeCode}
                            blurOnSubmit={false}
                            onSubmitEditing={()=>store.onCodeSubmitPress(this.refs)}
                            onBlur={store.onBlur}
                            onFocus={store.onCodeFocus}
                            returnKeyType='next'
                            placeholder='+1'
                            placeholderTextColor='rgb(206, 206, 206)' 
                            keyboardType='numeric'
                            maxLength={5}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText, store.codeValueError && styles.errorText]}
                        />
                    </Animatable.View>
                    <View
                        style={{ marginRight: percentW(2) }}
                    >
                    </View>
                    <Animatable.View
                        style={[styles.phone, { flex : 1}]}   //second input on the phones row

                        animation={store.phoneValueError && store.shakeTrigger ? 'shake' : ''}
                        duration={500}
                        useNativeDrive={true}
                        onAnimationEnd={()=> store.shakeTrigger = false}
                    >
                        <TextInput 
                            editable={!loading}
                            ref={'inputPhoneValue'}
                            value={store.phoneValue}
                            onChangeText={store.onChangePhone}
                            onFocus={store.onPhoneFocus}
                            onSubmitEditing={()=>store.onPhoneSubmitPress(this.refs)}
                            placeholder='phone number'
                            placeholderTextColor='rgb(206, 206, 206)'
                            returnKeyType='send'
                            keyboardType='numeric'
                            maxLength={15}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText, store.phoneValueError && styles.errorText]}
                        />
                    </Animatable.View>
                </View>

                <View style={[styles.loginButton, loading && { backgroundColor: 'transparent'}]} >
                    {
                    loading ?
                    <Image 
                        style={{ height: percentH(5), alignSelf: 'center' }}
                        source={images['loader']}
                        resizeMode='contain'
                    />
                    :
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={store.onSendPress}
                        disabled={loading}
                    >
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                        >Send</Text>

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
    container: {        
        height: percentH(45),
        width: percentW(74),
        alignSelf: 'center',
        marginTop: percentH(10),
        paddingHorizontal: percentW(5)
    },
    fullname : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'        
    },
    fullnameImage: {
        ...Platform.select({
            ios: {
                height: PixelRatio.getPixelSizeForLayoutSize(8),
                width: PixelRatio.getPixelSizeForLayoutSize(8),
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(6),
                width: PixelRatio.getPixelSizeForLayoutSize(6)
            }
        }),        
        marginRight: percentW(4),
        marginLeft: -percentW(1)
    },
    fullnameText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: 18, 
        /*fontWeight: '500'*/
    },    
    phone : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid',
    },
    phoneImage: {
        ...Platform.select({
            ios: {
                height: PixelRatio.getPixelSizeForLayoutSize(8),
                width: PixelRatio.getPixelSizeForLayoutSize(8),
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(6),
                width: PixelRatio.getPixelSizeForLayoutSize(6)
            }
        }), 
        marginRight: percentW(1),
        marginLeft: percentW(1)
    },
    phoneText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: 18, 
        /*fontWeight: '500'*/
    },
    text: {
        alignSelf: 'center',
        width: percentW(64),
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: 18, 
        fontWeight: '500',
        marginBottom: percentH(3)
    },
    loginButton: {        
        height: percentH(5.5),
        width: percentW(64),        
        borderRadius: 5,
        marginTop: percentH(3),
        backgroundColor: 'rgb(95, 188, 102)'        
    },
    error: {
        borderBottomColor: 'rgb(188, 0, 0)',
    },
    errorText: {
        color: 'rgb(188, 0, 0)'
    }
})