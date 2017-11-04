import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated,
    TextInput,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView
    } from 'react-native';

import { observer, inject } from 'mobx-react';
import { images } from './assets';

@inject('store')
@observer
export class Register extends Component{

    state = {
        top: 0,
        showToS: true
    }

    animatedValue = new Animated.Value(0);

    componentDidMount = () => {        
        setTimeout(()=>{
            Animated.timing(this.animatedValue, {
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
    // currentMarginTop - keyboardHeight + percent of (input fields + button)
    this.setState({ top: -e.endCoordinates.height + percentH(30), showToS: false})
  }

  _keyboardDidHide = () => {
    this.setState({ top: 0, showToS: true})
  }

  
    render(){
        const { register : store } = this.props.store;
        return(
            <Animated.View             
                style={[
                    styles.container, { marginTop: this.state.top },
                    {opacity: this.animatedValue } 
                ]}
            >                
            <View style={styles.avatarView} >
                <TouchableWithoutFeedback
                    onPress={()=> console.log('image press')}
                >
                    <Image
                        style={styles.avatar}
                        source={images['camera']}
                        resizeMode='contain'
                    />
                </TouchableWithoutFeedback>
            </View>       

                <View
                    style={[styles.userNameView, 
                        !this.state.showToS && {height: percentH(6), marginVertical: 0 } ]} >
                    <Text style={styles.userNameText} >{store.userName}</Text>
                </View>


                <View style={styles.email} >
                    <Image 
                        style={{ height: percentH(5), width: percentH(5), marginRight: 5}}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput
                        value={store.email}
                        onChangeText={store.onChangeEmail}
                        placeholder='email@email.com'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.email && { fontWeight: '500' }]}
                        placeholderTextColor='rgb(206, 206, 206)'
                    />
                </View>
            
                <View style={styles.pass} >
                    <Image 
                        style={{ height: percentH(5), width: percentH(5), marginRight: 5}}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput
                        value={store.pass}
                        onChangeText={store.onChangePass}
                        placeholder='Password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={styles.inputText}
                        placeholderTextColor='rgb(206, 206, 206)' 
                    />
                </View>

                <View style={[styles.pass, !this.state.showToS && { marginBottom: percentH(1.5)}]} >
                    <Image 
                        style={{ height: percentH(5), width: percentH(5), marginRight: 5}}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput 
                        value={store.passConfirm}
                        onChangeText={store.onChangePassConfirm}
                        placeholder='Confirm password'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={styles.inputText}
                        placeholderTextColor='rgb(206, 206, 206)' 
                    />
                </View>

                { 
                this.state.showToS &&
                <View
                    style={styles.tosView}
                >
                    <Text style={[styles.tosText, {fontSize: 14, color: 'rgb(255, 255, 255)' }]} >
                        By registering you accept our
                    </Text>

                    <TouchableOpacity 
                        onPress={store.onTosPress} 
                    >
                        <Text style={styles.tosText}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity>
                </View>
                }


                    <View style={styles.registerButton} >
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                            onPress={store.onRegisterPress}
                        >
                            <Text
                                style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                            >Register</Text>
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
        // height: percentH(45),
        flex: 1,
        width: percentW(64),
        alignSelf: 'center',
        // marginTop: percentH(20),
        paddingBottom: percentH(0)
    },
    userNameView : {
        height: percentH(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: percentH(3),
        },
    userNameText: {
        alignSelf: 'center',            
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontStyle: 'italic',
        fontSize: 20,
    },
    avatar: {
        height: percentH(10),
        width: percentH(10)
    },
    avatarView: {
        alignSelf: 'center',
        marginTop: percentH(12),
        justifyContent: 'center',
        alignItems: 'center',
        height: percentH(18),
        width: percentH(18),
        borderRadius: percentH(9),
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgb(255, 255, 255)',

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
    pass : {        
        height: percentH(7),
        flexDirection: 'row',        
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    inputText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: 20, 
        /*fontWeight: '500'*/
    },
    registerButton: {
        height: percentH(5.5),
        width: percentW(64),
        borderRadius: 5,
        backgroundColor: 'rgb(95, 188, 102)',        
    },    
    tosView: {
        height: percentH(7),
        marginBottom: percentH(3),
        marginTop: percentH(3),
        justifyContent: 'center',
        alignItems: 'center'        
    },
    tosText: {
        textAlign: 'center',        
        fontFamily: 'Arial', 
        fontSize: 13, 
        color: 'rgb(76, 154, 100)'
    }
})