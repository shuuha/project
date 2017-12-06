import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Keyboard,
    Image,
    PixelRatio,
    Vibration, 
    Platform
    } from 'react-native';

import { Redirect } from 'react-router-native';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { observer, inject } from 'mobx-react';
import { FacebookButton } from './FacebookButton';
import { images } from './assets';

@inject('store')
@observer
export class Main extends Component{
    state = {
        hideLine: false
    }

    animatedLogin = new Animated.Value(0);
    animatedTranslateY = new Animated.Value(0);

    componentDidMount = () => {        
        let ms;
        if(this.props.store.main.initialRender){
            ms = 2500;
        }
        else {
            ms = 200;
        }
        setTimeout(()=>{
            Animated.timing(this.animatedLogin, {
                toValue: 1,
                duration: 500,
                // useNativeDriver: true
            }).start(()=> this.props.store.main.initialRender = false);
        }, ms)
        this.props.store.main.Vibration = Vibration;
        this.props.store.main.refs = this.refs;
    }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    // facebook token verify function
    //
    // const token = this.props.store.loginView.token;
    // const url = 'https://graph.facebook.com/me?access_token='
    // axios.get(url+token)
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err));

    FBLoginManager.getCredentials( (error, data) => {
        if (!error) {
            console.log(error, data);
        }
        else {
            console.log(error);
        }
    });
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate(){
      const { emailError, passError } = this.props.store.main;
      if(emailError && passError){
          this.refs.email.focus();
      }
    //   this.props.store.loginView.emailError = false;
    //   this.props.store.loginView.passError = false;
  }

  _keyboardDidShow = (e) => {          
    this.setState({ hideLine: true });
    const keyboardHeightAndSomeMargin = -e.endCoordinates.height + percentH(24);
    Animated.timing(this.animatedTranslateY, {
        toValue: keyboardHeightAndSomeMargin,
        duration: 200,
        // userNativeDriver: true
    }).start();
    this.props.store.appStore.setInitialState();
  }

  _keyboardDidHide = () => {
    this.setState({ hideLine: false });
    Animated.timing(this.animatedTranslateY, {
        toValue: 0,
        duration: 200,
        // userNativeDriver: true
    }).start();
  }

  login = () => {
      const { appStore } = this.props.store;
      FBLoginManager.loginWithPermissions(['email', 'user_friends'], (error, data)=>{
          if(data && data.type){
            // this.props.store.fbInfo.data = data;
            console.log(data);
            this.props.store.main.onLoginWithFbButtonPress(error, data);
          }
          else {
              appStore.errorText = 'Unable to login with facebook';
          }
        // console.log('data: ', data, 'error: ', error);
      })
  }
    

    render(){        
        const { 
            main : store, 
            appStore: { loading },  
        } = this.props.store;
        return(            
            <Animated.View
                style={[ 
                    styles.container, 
                    { transform: [ { translateY: this.animatedTranslateY } ]}, 
                    { opacity: this.animatedLogin }
                ]}
            >
            
                <Animatable.View style={[styles.user ]} 
                    duration={500}
                    animation={store.emailError && store.shakeTrigger ? 'shake' : ''}
                    useNativeDriver={true}
                    onAnimationEnd = {()=> store.shakeTrigger = false}
                >
                    <Image
                        style={styles.icon}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        editable={!loading}
                        autoCorrect={false}
                        ref={'email'}
                        value={store.email}
                        onChangeText={store.onChangeEmail}
                        onFocus={store.onInputFocus}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={()=> store.onSubmitEmail(this.refs.pass)}
                        placeholder='email@email.com'
                        placeholderTextColor='rgb(206, 206, 206)'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent' 
                        style={[styles.userText, store.emailError && styles.errorText]}
                    />
                </Animatable.View>
            
                <Animatable.View style={[styles.pass]} 
                    duration={500}                
                    animation={store.passError && store.shakeTrigger ? 'shake' : ''}
                    useNativeDriver={true}
                    onAnimationEnd = {()=> store.shakeTrigger = false}
                >
                    <Image 
                        style={styles.icon}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        ref={'pass'}
                        autoCorrect={false}
                        editable={!loading}
                        value={store.pass}
                        onChangeText={store.onChangePass}
                        onFocus={store.onInputFocus}
                        onSubmitEditing={store.onSubmitPass}
                        returnKeyType='done'
                        placeholder='Password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={[styles.userText, store.passError && styles.errorText]}
                        placeholderTextColor='rgb(206, 206, 206)' 
                    />
                </Animatable.View>            

                <View style={[styles.loginButton, loading && { backgroundColor: 'transparent' }]} >
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
                        onPress={()=> store.onLoginButtonPress(this.refs, Vibration, this)}
                        disabled={loading}
                    >                    
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: percentW(4.5)}}
                        >Log in</Text>
                    </TouchableOpacity>
                }
                </View>
                <View
                    style={[{ 
                        borderTopWidth: 1, 
                        borderStyle: 'solid', 
                        borderColor: 'rgb(89, 113, 144)', 
                        marginBottom: percentH(1.5),
                        alignSelf: 'center',
                        width: percentW(40)
                    }, this.state.hideLine && { borderTopWidth: 0 }]}
                ></View>

                
                <FacebookButton 
                    disabled={loading}
                    onPress={this.login}
                    style={styles.fbButton}
                    textStyle={{ fontSize: percentW(4)}}
                />
                

                <View style={styles.forgetPass} >
                    <TouchableOpacity
                        onPress={store.onForgotPassPress}
                        disabled={loading}
                    >
                        <Text
                            style={styles.forgetPassText}
                        >Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={store.onSignUpPress}
                        disabled={loading}
                    >
                        <Text
                            style={styles.forgetPassText}
                        >Sign up</Text>
                    </TouchableOpacity>
                </View>
                
            </Animated.View>
        );
    }
}

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
};

const percentW = (num) => {
    return (width / 100) * num;
};

const styles = StyleSheet.create({
    container: {        
        height: percentH(45),
        width: percentW(74),
        alignSelf: 'center',
        marginTop: percentH(20),
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
    user : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',        
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    pass : {        
        height: percentH(7),
        flexDirection: 'row',        
        alignItems: 'center',
        marginBottom: percentH(1.5),
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    userText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(4.5), 
    },
    loginButton: {        
        height: percentH(5.5),        
        borderRadius: 5,
        marginBottom: percentH(1.5),
        backgroundColor: 'rgb(95, 188, 102)',
    },
    fbButton: {
        height: percentH(5.5)
    },
    forgetPass: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: percentH(11.5),
        marginLeft: percentW(1),
        marginRight: percentW(1),
        marginBottom: percentW(1)
    },
    forgetPassText: {
        fontFamily: 'Arial', 
        // fontSize: percentW(4.4),
        fontSize: percentW(4),
        color: 'rgb(255, 255, 255)', 
        // fontWeight: '500'
    },
    error: {
        borderBottomColor: 'rgb(188, 0, 0)',
    },
    errorText: {
        color: 'rgb(188, 0, 0)'
    }
})