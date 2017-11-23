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
import { FBLoginView } from '../login';
import { images } from './assets';

@inject('store')
@observer
export class LoginView extends Component{
    state = {
        top : percentH(20),
        newTop: null,
        hideLine: false
    }

    animatedLogin = new Animated.Value(0);


    componentDidMount = () => {
        let ms;
        if(this.props.store.loginView.isLoginViewInitialRender){
            ms = 2500;
        }
        else {
            ms = 200;
        }
        setTimeout(()=>{
            Animated.timing(this.animatedLogin, {
                toValue: 1,
                duration: 500
            }).start(()=> this.props.store.loginView.isLoginViewInitialRender = false);
        }, ms)
        this.props.store.loginView.Vibration = Vibration;
        this.props.store.loginView.refs = this.refs;
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
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate(){
      const { emailError, passError } = this.props.store.loginView;
      if(emailError && passError){
          this.refs.email.focus();
      }
    //   this.props.store.loginView.emailError = false;
    //   this.props.store.loginView.passError = false;
  }

  _keyboardDidShow = (e) => {
    // pushing the view up, the overall distance is calculated from : 
    // currentMarginTop - keyboardHeight + percent of (user field + pass field + login button)
    this.setState({ newTop: this.state.top - e.endCoordinates.height + percentH(24), hideLine: true})
  }

  _keyboardDidHide = () => {
    this.setState({ newTop: null, hideLine: false})
  }

  login = () => {
      FBLoginManager.loginWithPermissions(['email', 'user_friends'], (error, data)=>{
          if(data && data.type){
            // this.props.store.fbInfo.data = data;
            console.log(data);
            this.props.store.loginView.onLoginWithFbButtonPress(error, data);
          }
          else {
              this.props.store.errorText = 'Unable to login with facebook';
          }
        // console.log('data: ', data, 'error: ', error);
      })
  }
  
    render(){        
        const { loginView : store, loading, error  } = this.props.store;
        return(
            this.props.store.loggedIn ?

            <Redirect to='/loggedin' />
            :            
            <Animated.View             
                style={[
                    styles.container, this.state.newTop && { marginTop: this.state.newTop },
                    {opacity: this.animatedLogin } 
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
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
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

                <View
                    style={styles.fbButton}
                >                
                    <FBLogin
                        buttonView={
                            <FBLoginView 
                                onPress={this.login}
                                disabled={loading}
                            />
                        }
                        ref={(fbLogin) => { this.fbLogin = fbLogin }}
                        loginBehavior={FBLoginManager.LoginBehaviors.Native}
                        permissions={["email","user_friends"]}
                        onLogin={function(data){
                            console.log("Logged in!");
                            console.log(data);
                            
                        }}
                        onLoginFound={function(e){console.log('login found', e)}}
                        onLoginNotFound={function(e){console.log('not found', e)}}
                        onLogout={function(e){console.log('logout', e)}}
                        onCancel={function(e){console.log('cancel', e)}}
                        onPermissionsMissing={function(e){console.log('permission missing', e)}}
                    />
                </View>

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
//calculated based on the width == 360
const SCALE_FACTOR = 20;
const responsiveFontsize = width / 20;
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
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(6),
                width: PixelRatio.getPixelSizeForLayoutSize(6)
            }
        }),
        marginRight: 5
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
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    userText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: 18, 
        /*fontWeight: '500'*/
    },
    loginButton: {        
        height: percentH(5.5),
        width: null,
        flex: 1,
        borderRadius: 5,
        marginBottom: percentH(1.5),
        backgroundColor: 'rgb(95, 188, 102)',        
    },
    fbButton:{
        height: percentH(5.5),
        width: null,
        flex: 1
    },
    forgetPass: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: percentH(12.5),
        marginLeft: percentW(1),
        marginRight: percentW(1),
    },
    forgetPassText: {
        fontFamily: 'Arial', 
        fontSize: 16, 
        color: 'rgb(255, 255, 255)', 
        fontWeight: '500'
    },
    error: {
        borderBottomColor: 'rgb(188, 0, 0)',
    },
    errorText: {
        color: 'rgb(188, 0, 0)'
    }
})