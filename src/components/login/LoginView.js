import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated,
    TextInput,
    Dimensions,
    TouchableOpacity
    } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import { observer, inject } from 'mobx-react';

import { FBLoginView } from '../login';


@observer
export class LoginView extends Component{

    animatedLogin = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedLogin, {
                toValue: 1,
                duration: 1000
            }).start();
        }, 2200)
    }

    render(){
        return(
            <Animated.View style={[styles.container, { opacity: this.animatedLogin }]}>
                <View style={styles.user} >
                    <Icon 
                        name='user'
                        size={percentH(7-2)}
                        style={{ color: 'rgb(255, 255, 255)', marginRight: 5 }}
                    />
                    <TextInput 
                        placeholder='email@email.com'
                        underlineColorAndroid='transparent'
                        style={styles.userText}
                        placeholderTextColor='rgb(201, 202, 204)' 
                    />
                </View>
            
                <View style={styles.pass} >
                    <Icon 
                        name='lock'
                        size={percentH(7-2)}
                        style={{ color: 'rgb(255, 255, 255)', marginRight: 5 }}
                    />
                    <TextInput 
                        placeholder='password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={styles.userText}
                        placeholderTextColor='rgb(201, 202, 204)' 
                    />
                </View>
                
                
                <View style={styles.loginButton} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        // onPress={}
                    >
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                        >Log in</Text>
                    </TouchableOpacity>
                </View>
                    
                <View
                    style={{ 
                        borderTopWidth: 1, 
                        borderStyle: 'solid', 
                        borderColor: 'rgb(89, 113, 144)', 
                        marginBottom: percentH(1.5),
                        alignSelf: 'center',
                        width: percentW(40)
                    }}
                ></View>

                <View
                    style={styles.fbButton}
                >
                    <FBLogin
                        buttonView={<FBLoginView />}
                        ref={(fbLogin) => { this.fbLogin = fbLogin }}
                        loginBehavior={FBLoginManager.LoginBehaviors.Native}
                        permissions={["email","user_friends"]}
                        onLogin={function(e){console.log(e)}}
                        onLoginFound={function(e){console.log(e)}}
                        onLoginNotFound={function(e){console.log(e)}}
                        onLogout={function(e){console.log(e)}}
                        onCancel={function(e){console.log(e)}}
                        onPermissionsMissing={function(e){console.log(e)}}
                    />
                </View>
        
                <View style={styles.forgetPass} >
                    <TouchableOpacity
                        // onPress={}
                    >
                        <Text
                            style={styles.forgetPassText}
                        >Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        // onPress={}
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

const border = {
        
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        height: percentH(45),
        alignSelf: 'center',        
        width: '64%',
        marginBottom: percentH(3)            
    },
    user : {
        height: percentH(7),
        flexDirection: 'row', 
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
        fontWeight: '500'
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
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'gray'
        
    },
    forgetPass: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: percentH(12.5),        
    },
    forgetPassText: {
        fontFamily: 'Arial', 
        fontSize: 16, 
        color: 'rgb(255, 255, 255)', 
        fontWeight: '500'
    }
})


    // renderSignInWithFbButton = () => {
    //     return(
    //         <View
    //             style={{ 
    //                 height: this.percent(5.5),
    //                 marginTop: this.percent(1.5)
    //              }}
    //         >
    //             <Icon.Button 
    //                 name="facebook"
    //                 backgroundColor="#3b5998"                     
    //                 // onPress={this.loginWithFacebook}
    //             >
    //                 <Text 
    //                     style={{fontFamily: 'Arial', fontSize: 15}}
    //                 >Login with Facebook</Text>
    //             </Icon.Button>
    //         </View>
    //     );
    // }