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
    Platform
    } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { observer, inject } from 'mobx-react'; 
import { images } from './assets';

@inject('store')
@observer
export class PassRecovery extends Component{   

    animatedView = new Animated.Value(0);
    animatedTranslateY = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200);

        this.props.store.passRecovery.refs = this.refs;
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
        const keyboardHeightAndSomeMargin = -e.endCoordinates.height + percentH(28);
        Animated.timing(this.animatedTranslateY, {
            toValue: keyboardHeightAndSomeMargin,
            duration: 200
        }).start();

        const { appStore } = this.props.store;
        appStore.setInitialState();        
        this.props.store.passRecovery.toggleTextVisibility();
    }

    _keyboardDidHide = () => {
        Animated.timing(this.animatedTranslateY, {
            toValue: 0,
            duration: 200
        }).start();
        this.props.store.passRecovery.toggleTextVisibility();
    }

    render(){
        const { 
            passRecovery : store, 
            appStore: { loading, errorText },
        } = this.props.store;
        return(
            <Animated.View style={[
                    styles.container, 
                    { transform: [ { translateY: this.animatedTranslateY } ]}, 
                    { opacity: this.animatedView }
                ]} 
            >
                {   !errorText
                    &&
                    <Text
                        style={styles.text}
                    >To reset your password, please enter 
                        your email address and phone number</Text>
                }

                <Animatable.View 
                        animation={store.emailError && store.shakeTrigger ? 'shake' : ''}
                        duration={500}
                        useNativeDrive={true}
                        onAnimationEnd={()=> store.shakeTrigger = false}
                        style={[styles.email]}
                    >
                    <Image 
                        style={styles.icon}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        ref={'email'}
                        editable={!loading}
                        autoCorrect={false}
                        value={store.email}
                        returnKeyType='next'
                        onChangeText={store.onChangeText('email')}
                        onSubmitEditing={store.onSubmitFocusNextInput('email')}
                        blurOnSubmit={false}
                        placeholder='email@email.com'
                        placeholderTextColor='rgb(206, 206, 206)'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent'
                        style={[styles.emailText]}
                    />
                </Animatable.View>
                <View
                    style={{ flexDirection: 'row' }}
                >
                    <Animatable.View 
                        animation={store.codeError && store.shakeTrigger ? 'shake' : ''}
                        duration={500}
                        useNativeDrive={true}
                        onAnimationEnd={()=> store.shakeTrigger = false}
                        style={[styles.phone, { width: percentW(23) }]}            // first input on the phone's row
                    >
                        <Image 
                            style={styles.phoneImage}
                            source={images['phone']}
                            resizeMode='contain'
                        />
                        <TextInput 
                            ref={'code'}
                            editable={!loading}
                            value={store.code}
                            blurOnSubmit={false}
                            onChangeText={store.onChangeText('code')}
                            onSubmitEditing={store.onSubmitFocusNextInput('code')}
                            onBlur={store.onBlur('code')}
                            onFocus={store.onFocus('code')}
                            returnKeyType='next'
                            placeholder='+1'
                            placeholderTextColor='rgb(206, 206, 206)' 
                            keyboardType='numeric'
                            maxLength={5}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText, store.codeError && styles.errorText]}
                        />
                    </Animatable.View>
                    <View
                        style={{ marginRight: percentW(2) }}
                    >
                    </View>
                    <Animatable.View
                        style={[styles.phone, { flex : 1}]}   //second input on the phones row
                        animation={store.phoneError && store.shakeTrigger ? 'shake' : ''}
                        duration={500}
                        useNativeDrive={true}
                        onAnimationEnd={()=> store.shakeTrigger = false}
                    >
                        <TextInput 
                            editable={!loading}
                            ref={'phone'}
                            value={store.phone}
                            // onFocus={store.onPhoneFocus}
                            onChangeText={store.onChangeText('phone')}
                            onSubmitEditing={store.onSubmitFocusNextInput('phone')}
                            placeholder='phone number'
                            placeholderTextColor='rgb(206, 206, 206)'
                            returnKeyType='send'
                            keyboardType='numeric'
                            maxLength={15}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText, store.phoneError && styles.errorText]}
                        />
                    </Animatable.View>
                </View>
                <View style={[ styles.sendButton, loading && { backgroundColor: 'transparent'} ]} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={store.onResetButtondPress}
                        disabled={loading}
                    >
                    {
                        loading ?
                        <Image 
                            style={{ height: percentH(5), alignSelf: 'center' }}
                            source={images['loader']}
                            resizeMode='contain'
                        />
                        :
                        <Text
                            style={{ 
                                color: 'rgb(255, 255, 255)', 
                                fontSize: percentW(4.5), 
                                // fontWeight: '500'
                            }}
                        >Reset password</Text>
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
        width: percentW(74),
        alignSelf: 'center',
        marginTop: percentH(10),
        paddingHorizontal: percentW(5)
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
                width: PixelRatio.getPixelSizeForLayoutSize(6),
                marginRight: percentW(1)
            }
        }),
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
        fontSize: percentW(4.5), 
        /*fontWeight: '500'*/
    },
     phone : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid',
    },
    phoneImage: {
        ...Platform.select({
            ios: {
                height: PixelRatio.getPixelSizeForLayoutSize(8),
                width: PixelRatio.getPixelSizeForLayoutSize(8),
                marginRight: percentW(2),
                marginLeft: percentW(1)
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(6),
                width: PixelRatio.getPixelSizeForLayoutSize(6),
                marginRight: percentW(1),
                marginLeft: percentW(1)
            }
        }), 
    },
    phoneText: {
        flex: 1,
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial', 
        fontSize: percentW(4.5), 
        /*fontWeight: '500'*/
    },
    text: {
        alignSelf: 'center',
        width: percentW(64),
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: percentW(4.5), 
        // fontWeight: '500',
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
    errorText: {
        color: 'rgb(188, 0, 0)'
    }
})
