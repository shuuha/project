import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image,
    Animated,
    TextInput,
    Dimensions,
    TouchableOpacity
    } from 'react-native';

import { LoginView, Logo } from '../login';

import { observer } from 'mobx-react';

import { loginStore as store } from '../../stores/LoginStore';

const { height, width } = Dimensions.get('window');

export class Login extends Component{
    render(){
        return(
            <View style={styles.container} >

                <Logo />
                <LoginView />



{/*                <Animated.View
                    style={[styles.inputView, this.phoneInputTransform()]}
                >
                    <TextInput 
                        style={styles.input}
                        value={store.phoneNo}
                        placeholder='your phone number'
                        underlineColorAndroid='transparent'
                        onChangeText={store.onChangePhoneText}
                        onSubmitEditing={()=> store.onSubmitEditingPhone(this)}
                    />
                </Animated.View>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(25, 58, 101)',
    }
});