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
    PixelRatio,
    Vibration,
    Platform
    } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { observer, inject } from 'mobx-react';
import { images } from './assets';

@inject('store')
@observer
export class PassChange extends Component {

    animatedValue = new Animated.Value(0);
    animatedTranslateY = new Animated.Value(0);

    minInput = Platform.OS === 'ios' ? -35 : -100;
    
    heightInterpolate = this.animatedTranslateY.interpolate({
        inputRange: [this.minInput, 0],
        outputRange: [0, percentH(15)],
        extrapolate: 'clamp'
    });

    componentDidMount() {
        setTimeout( () => {
            Animated.timing(this.animatedValue, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)

        this.props.store.passChange.refs = this.refs;
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);        
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        const keyboardHeightAndSomeMargin = -e.endCoordinates.height + percentH(35);
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
    
    render() {
        const { 
            passChange : store, 
            appStore: { loading, errorText }
            } = this.props.store;
        return (
            <Animated.View
                style={[
                    styles.container, 
                    { transform: [ { translateY: this.animatedTranslateY } ]},
                    { opacity: this.animatedValue }
                ]}
            >
                <Animated.View style={[styles.textContainer, { height: this.heightInterpolate } ]}>
                    <Text
                        style={styles.text}
                    >{store.text}</Text>
                </Animated.View>

                <Animatable.View
                    style={[styles.pass]}
                    duration={500}
                    animation={ store.passError && store.shakeTrigger ? 'shake' : '' }
                    useNativeDriver={true}
                    onAnimationEnd={()=> store.shakeTrigger = false}
                >

                    <Image
                        style={styles.icon}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput
                        ref={'pass'}
                        editable={!loading}
                        autoCorrect={false}
                        value={store.pass}
                        onChangeText={store.onChangeText('pass')}
                        // onFocus={store.onInputFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={store.onSubmitFocusNextInput('pass')}
                        placeholder='Password'
                        placeholderTextColor='rgb(206, 206, 206)'
                        returnKeyType='next'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.passError && styles.errorText]}
                    />
                </Animatable.View>

                <Animatable.View 
                    style={styles.pass} 
                    duration={500}
                    animation={ store.passConfirmError && store.shakeTrigger ? 'shake' : '' }
                    useNativeDriver={true}
                    onAnimationEnd={()=> store.shakeTrigger = false}
                        >
                    <Image 
                        style={styles.icon}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput
                        ref={'passConfirm'}
                        editable={!loading}
                        autoCorrect={false}
                        value={store.passConfirm}
                        onChangeText={store.onChangeText('passConfirm')}
                        // onFocus={store.onInputFocus}
                        onSubmitEditing={store.onSubmitFocusNextInput('passConfirm')}
                        blurOnSubmit={false}
                        placeholder='Confirm password'
                        placeholderTextColor='rgb(206, 206, 206)' 
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.passConfirmError && styles.errorText]}
                    />
                </Animatable.View>
                    <View style={[styles.submitButton, loading && {backgroundColor: 'transparent'}]} >
                      {  loading ?
                        <Image 
                            style={{ height: percentH(5), alignSelf: 'center' }}
                            source={images['loader']}
                            resizeMode='contain'
                        />
                        :
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                            onPress={store.onChangePassPress}
                            disabled={loading}
                        >                        
                            <Text
                                style={{ 
                                    color: 'rgb(255, 255, 255)', 
                                    fontSize: percentW(5), 
                                }}
                            >Change password</Text>
                        </TouchableOpacity>
                        }
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
        height,
        width: percentW(74),
        alignSelf: 'center',
        paddingHorizontal: percentW(5)
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        alignSelf: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: percentW(4.5),
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
    pass : {        
        height: percentH(7),
        flexDirection: 'row',        
        alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    inputText: {
        flex: 1,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(4.5)
    },
    submitButton: {
        height: percentH(5.5),
        width: percentW(64),
        marginTop: percentH(1.5),
        borderRadius: 5,
        backgroundColor: 'rgb(95, 188, 102)'
    },    
    errorText: {
        color: 'rgb(188, 0, 0)',
    }
});