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
    ActivityIndicator
    } from 'react-native';

import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { observer, inject } from 'mobx-react';
import { FBLoginView } from '../login';
import { images } from './assets';

@inject('store')
@observer
export class LoginView extends Component{
    state = {
        top : percentH(20),
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
    // currentMarginTop - keyboardHeight + percent of (user field + pass field + login button)
    this.setState({ top: this.state.top - e.endCoordinates.height + percentH(24), hideLine: true})
  }

  _keyboardDidHide = () => {
    this.setState({ top: percentH(20), hideLine: false})
  }

  login = () => {
    //   FBLoginManager.loginWithPermissions(['email', 'user_friends'], (data, error)=>{
    //     console.log(data, 'error: ', error)
    // });
    console.log(this);
  }

  onLoginButtonPress = () => {
      Keyboard.dismiss();
      this.props.store.loginView.onLoginButtonPress();
  }
    render(){
        const { loginView : store, loading, error  } = this.props.store;
        return(
            <Animated.View             
                style={[
                    styles.container, { marginTop: this.state.top },
                    {opacity: this.animatedLogin } 
                ]}
            >          


                <View style={[styles.user]} > 
                    <Image 
                        style={{ 
                            height: PixelRatio.getPixelSizeForLayoutSize(6),
                            width: PixelRatio.getPixelSizeForLayoutSize(6),
                            marginRight: 5
                        }}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        editable={!loading}
                        value={store.email}
                        onChangeText={store.onChangeEmail}
                        onFocus={store.onInputFocus}
                        returnKeyType='next'
                        // blurOnSubmit={false}
                        onSubmitEditing={()=> store.onSubmitEmail(this.refs.pass)}
                        placeholder='email@email.com'
                        placeholderTextColor='rgb(206, 206, 206)'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent' 
                        style={[styles.userText]}
                    />
                </View>
            
                <View style={styles.pass} >
                    <Image 
                        style={{ 
                            height: PixelRatio.getPixelSizeForLayoutSize(6), 
                            width: PixelRatio.getPixelSizeForLayoutSize(6), 
                            marginRight: 5
                        }}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        ref={'pass'}
                        editable={!loading}
                        value={store.pass}
                        onChangeText={store.onChangePass}
                        onFocus={store.onInputFocus}
                        onSubmitEditing={store.onSubmitPass}
                        returnKeyType='done'
                        placeholder='Password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={styles.userText}
                        placeholderTextColor='rgb(206, 206, 206)' 
                    />
                </View>
            
            
                <View style={styles.loginButton} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={this.onLoginButtonPress}
                        disabled={loading}
                    >
                    {   loading ? 
                        <ActivityIndicator 
                            size={percentH(6)}
                            color='rgb(255, 255, 255)'
                        />
                        :
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                        >Log in</Text>
                    }
                    </TouchableOpacity>
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
        marginTop: percentH(20),        
    },
    user : {
        height: percentH(7),
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    pass : {        
        height: percentH(7),
        flexDirection: 'row',        
        alignItems: 'center',
        marginBottom: percentH(1.5),
        borderTopWidth: 1,
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
    }
})