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
    PixelRatio
} from 'react-native';
import { images } from './assets';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class SignUp extends Component{

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
    this.setState({ top: this.state.top - e.endCoordinates.height + percentH(27)})
    }

    _keyboardDidHide = () => {
        this.setState({ top: percentH(10)})
    }

    render(){
        const { signUp : store } = this.props.store;
        return(            
            <Animated.View style={[
                    styles.container, 
                    { opacity: this.animatedView }, 
                    { marginTop: this.state.top }
                ]} 
            >

                <Text
                    style={styles.text}
                >Enter your phone number</Text>

                <View style={[styles.fullname]} >
                    <Image 
                        style={styles.fullnameImage}
                        source={images['man']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        value={store.fullname}
                        onChangeText={store.onChangeName}                        
                        placeholder='Fullname'
                        placeholderTextColor='rgb(206, 206, 206)'
                        autoCapitalize='words'
                        autoCorrect={false}
                        returnKeyType='next'
                        // blurOnSubmit={false}
                        onSubmitEditing={()=>store.onNameSubmitPress(this.refs)}
                        underlineColorAndroid='transparent'
                        style={[styles.fullnameText]}
                    />
                </View>
                <View
                    style={{ flexDirection: 'row' }}
                >
                    <View 
                        style={[styles.phone, { width: percentW(23) }]}            // first input on the phone's row
                    >
                        <Image 
                            style={styles.phoneImage}
                            source={images['phone']}
                            resizeMode='contain'
                        />
                        <TextInput 
                            ref={'inputCode'}
                            value={store.codeValue}
                            onChangeText={store.onChangeCode}
                            // blurOnSubmit={false}
                            onSubmitEditing={()=>store.onCodeSubmitPress(this.refs)}
                            onBlur={store.onBlur}
                            onFocus={store.onFocus}
                            returnKeyType='next'
                            placeholder='+1'
                            placeholderTextColor='rgb(206, 206, 206)' 
                            keyboardType='numeric'
                            maxLength={5}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText]}
                        />
                    </View>
                    <View
                        style={{ marginRight: percentW(2) }}
                    >
                    </View>
                    <View
                        style={[styles.phone, { flex : 1}]}   //second input on the phones row
                    >
                        <TextInput 
                            ref={'inputPhone'}
                            value={store.phoneValue}
                            onChangeText={store.onChangePhone}
                            onSubmitEditing={()=>store.onPhoneSubmitPress(this.refs)}
                            placeholder='phone number'
                            placeholderTextColor='rgb(206, 206, 206)'
                            returnKeyType='send'
                            keyboardType='numeric'
                            maxLength={15}
                            underlineColorAndroid='transparent'
                            style={[styles.phoneText]}
                        />
                    </View>
                </View>

                <View style={styles.loginButton} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={store.onSendPress}
                    >
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                        >Send</Text>
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
        height: PixelRatio.getPixelSizeForLayoutSize(6), 
        width: PixelRatio.getPixelSizeForLayoutSize(6),
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
        height: PixelRatio.getPixelSizeForLayoutSize(6),
        width: PixelRatio.getPixelSizeForLayoutSize(6),
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
})