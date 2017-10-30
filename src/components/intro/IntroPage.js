import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image,
    Animated,
    TextInput,
    Dimensions
    } from 'react-native';
import { observer } from 'mobx-react';

import { introStore as store } from '../../stores/IntroStore';
import { images } from './assets';

const { height, width } = Dimensions.get('window');

export class IntroPage extends Component{ 

        logoAnimation = new Animated.Value(0);
        phoneInputAnimation = new Animated.Value(300);
        smsInputAnimation = new Animated.Value(300);

    componentDidMount(){

        setTimeout(()=> {
            Animated.sequence([
                Animated.timing(this.logoAnimation, {
                toValue: -200,
                duration: 2000
            }),
            Animated.timing(this.phoneInputAnimation, {
                toValue: 0,
                duration: 500
            })
            ]).start()
        }, 2000)
    }

    componentDidUpdate(){        
        if(store.moveToNext){
            setTimeout(()=> {                
                this.phoneInputAnimation.setValue(0);
                Animated.sequence([
                    Animated.timing(this.phoneInputAnimation, {
                    toValue: -300,
                    duration: 500
                    }),
                    Animated.timing(this.smsInputAnimation, {
                        toValue: 0,
                        duration: 500
                    })
                ]).start(()=> store.moveToNext = false)
            }, 500)
        }
    }

    logoTransform = () =>{
        return {
            transform: [ { translateY: this.logoAnimation }]
        }
    }

    phoneInputTransform = () =>{
        return {
            transform: [{ translateX: this.phoneInputAnimation }]
        }
    }

    smsInputTransform = () => {
        return {
            transform: [{ translateX: this.smsInputAnimation }]
        }
    }

    render(){
        return(
            <View
                style={styles.container}
            >
                <Animated.View
                    style={[styles.logoView, this.logoTransform() ]}
                >
                    <Image
                        style={styles.logo} 
                        source={images['logo']}
                        resizeMode='contain'
                    />
                </Animated.View>
                
                <Animated.View
                    style={[styles.inputView, this.smsInputTransform()]}
                >
                   <TextInput 
                        style={styles.input}
                        value={store.smsCode}
                        placeholder='enter sms code'
                        underlineColorAndroid='transparent'
                        onChangeText={store.onChangeSmsText}
                        onSubmitEditing={()=>store.onSubmitEditingSms(this)}
                    />
                </Animated.View>                    
                <Animated.View
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
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1        
    },
    logoView:{
        position: 'absolute',
        top: height / 4,
        alignSelf: 'center'
    },
    logo: {
        height: height / 3,
        width: width / 2,
    },
    inputView: {
        position: 'absolute',
        top: '50%',
        height: 50,
        width: '70%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',        
    },
        
    input: {
        flex: 1,
        fontSize: 25,
        textAlign: 'center'
    }
});