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
    Vibration
    } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { observer, inject } from 'mobx-react';
import KeyEvent from 'react-native-keyevent';
import { images } from './assets';

const NUMBER_OF_INPUTS = [1, 2, 3, 4];

@inject('store')
@observer
export class ActivationCode extends Component{    

    animatedView = new Animated.Value(0);
    animatedTranslateY = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        this.refs.input0.focus();
        }, 200)

        this.props.store.activation.refs = this.refs;
        this.props.store.activation.Vibration = Vibration;
        Keyboard.dismiss();
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        KeyEvent.onKeyDownListener((keyCode) => { 
            this.props.store.activation.onInputDeleteKeyPress(keyCode, this.refs);

        });
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        KeyEvent.removeKeyDownListener();
    }

    componentDidUpdate(){
        // if(this.props.store.activation.errorValues){
        //     this.refs.input0.focus();
        // }
        
    }

    _keyboardDidShow = (e) => {          
        const keyboardHeightAndSomeMargin = -e.endCoordinates.height + percentH(27);
        Animated.timing(this.animatedTranslateY, {
            toValue: keyboardHeightAndSomeMargin,
            duration: 200
        }).start();
    }

    _keyboardDidHide = () => {
        Animated.timing(this.animatedTranslateY, {
            toValue: 0,
            duration: 200
        }).start();
    }
    

    render(){
        const { 
            activation: {
                values,
                onInputChange,
                onChangeText,
                onSelectionChange,
                onEnter,
                onFocus,
                onSubmitEditing,
                errorValues,
                wrongSmsCode,
                resendCode,
                resendMessage,
                canResend,
                swingTrigger },
            loading,
            errorText
            } = this.props.store;

            const renderText = () => {
                if(errorText){
                    return ' ';
                }
                else if(resendMessage){
                    return resendMessage;
                }
                else {
                    return 'Enter activation code';
                }
            }

        return(
            
            <Animated.View style={[
                    styles.container, 
                    { transform: [ { translateY: this.animatedTranslateY } ]}, 
                    { opacity: this.animatedView }, 
                ]} 
            >
                <Animatable.View
                    style={styles.textContainer}
                    animation={swingTrigger ? 'swing' : ''}
                    duration={500}
                    useNativeDrive={true}
                    onAnimationEnd={()=> this.props.store.activation.swingTrigger = false}
                >
                    <Text
                        style={styles.text}
                    >{renderText()}</Text>
                </Animatable.View>
                <Animatable.View
                        duration={500}
                        animation={ errorValues ? 'shake' : '' }
                        onAnimationEnd={()=> this.refs.input0.focus()}
                        useNativeDriver={true}            
                >
                    <View style={[styles.inputsContainer ]} 
                    >
                        {
                           NUMBER_OF_INPUTS.map((q, i) => 
                            <View                        
                                key={i}
                                style={{ flex: 1, flexDirection: 'row', height: percentH(8) }}
                            >
                                <TextInput
                                    editable={!loading}
                                    ref={`input${i}`}
                                    // onKeyPress={(e)=> Alert.alert(e)}
                                    keyboardType='numeric'
                                    underlineColorAndroid='transparent'
                                    value={values[i]}
                                    maxLength={1}
                                    onChange={(e)=> onInputChange(this.refs, i, e)}
                                    onChangeText={(e)=> onChangeText(e, i)}
                                    onSelectionChange={onSelectionChange}
                                    onFocus={()=> onFocus(i)}
                                    onSubmitEditing={onSubmitEditing}
                                    // blurOnSubmit={false}
                                    style={[styles.inputText, wrongSmsCode && styles.errorText]}
                                />
                                <View
                                    style={{ flex: 0.2}}
                                >
                                </View>
                            </View>
                            )                        
                        }
                    </View>
                </Animatable.View>

                <View style={[styles.enterButton, loading && { backgroundColor: 'transparent'}]} >
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
                        onPress={onEnter}
                        disabled={loading}
                    >
                        <Text
                            style={{ 
                                color: 'rgb(255, 255, 255)', 
                                fontSize: percentW(5), 
                                fontWeight: '500'
                            }}
                        >Enter</Text>
                    </TouchableOpacity>
                }
                </View>
                <TouchableOpacity                    
                    onPress={resendCode}
                    disabled={!canResend || loading }
                >
                    <Text
                        style={[styles.text, { marginTop: percentH(15)},
                                !canResend && { color: 'rgb(137, 137, 137)' } ]}
                    >Resend activation code</Text>
                </TouchableOpacity>
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
        height: percentH(55),
        width: percentW(64),
        alignSelf: 'center',
        marginTop: percentH(10),
    },
    inputsContainer : {
        height: percentH(7),
        width: percentW(64),
        flexDirection: 'row', 
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: percentH(3),

    },
    inputText: {        
        flex: 0.8,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(7),
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid',
        textAlign: 'center',
        fontWeight: '500'
    },
    textContainer: {
        width: percentW(64),
        height: percentH(8),
        marginBottom: percentH(2.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        // alignSelf: 'center',
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: percentW(5.6),  
        fontWeight: '500',
    },
    enterButton: {
        height: percentH(5.5),
        width: percentW(64),        
        borderRadius: 5,
        marginBottom: percentH(1.5),
        marginTop: percentH(1.5),
        backgroundColor: 'rgb(95, 188, 102)',        
    },
    errorText: {
        color: 'rgb(188, 0, 0)',
    }
})
