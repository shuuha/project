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
export class Register extends Component{

    state = { showToS: true };

    animatedValue = new Animated.Value(0);
    animatedTranslateY = new Animated.Value(0);
    
    heightInterpolate = this.animatedTranslateY.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, percentH(10)],
        extrapolate: 'clamp'
    })

    marginInterpolate = this.animatedTranslateY.interpolate({
        inputRange: [-100, 0],
        outputRange: [Platform.OS === 'ios' ? percentH(1.5) : percentH(0.5), percentH(3)],
        extrapolate: 'clamp'
    })

    componentDidMount = () => {
            setTimeout(()=>{
                Animated.timing(this.animatedValue, {
                    toValue: 1,
                    duration: 200
                }).start();
            }, 200)

            this.props.store.register.refs = this.refs;
            this.props.store.register.Vibration = Vibration;
        }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        
        this.props.store.appStore.showLogo = false;
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        this.setState({ showToS: false });
        const keyboardHeightAndSomeMargin = -e.endCoordinates.height + percentH(30);
        Animated.timing(this.animatedTranslateY, {
            toValue: keyboardHeightAndSomeMargin,
            duration: 200
        }).start();
    }

    _keyboardDidHide = () => {        
        Animated.timing(this.animatedTranslateY, {
            toValue: 0,
            duration: 200
        }).start(this.setState({ showToS: true }));
    }
    
    render(){
        const { 
            register : store, 
            register : { photos }, 
            appStore: { loading, errorText }
            } = this.props.store;
        return(
            <Animated.View             
                style={[
                    styles.container, 
                    { transform: [ { translateY: this.animatedTranslateY } ]},
                    { opacity: this.animatedValue }
                ]}
            >                
            <View style={styles.avatarView} >
                <TouchableWithoutFeedback
                    onPress={store.onAvatarPress}
                    disabled={loading}
                >
                    <Image
                        style={[styles.avatar, photos.imageUri && styles.image]}
                        source={ photos.imageUri ? { uri: photos.imageUri} : images['camera']}
                        resizeMode = { photos.imageUri ? 'cover' : 'contain'}
                    />
                </TouchableWithoutFeedback> 
            </View>

                <Animated.View
                    style={[styles.userNameView,                         
                        { height: this.heightInterpolate, marginVertical: this.marginInterpolate }
                    ]} > 
                    <Text 
                        style={styles.userNameText} 
                    > { errorText ? '' : this.props.store.signUp.fullname}</Text>
                </Animated.View>


                <Animatable.View 
                    style={[styles.email]} 
                    duration={500}
                    animation={ store.emailError && store.shakeTrigger ? 'shake' : '' }
                    useNativeDriver={true}
                    onAnimationEnd={()=> store.shakeTrigger = false}
                >
                    <Image 
                        style={styles.icon}
                        source={images['mail']}
                        resizeMode='contain'
                    />
                    <TextInput
                        ref={'email'}
                        editable={!loading}
                        autoCorrect={false}
                        value={store.email}
                        returnKeyType='next'
                        onChangeText={store.onChangeEmail}
                        onFocus={store.onInputFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={()=> store.onSubmitEmail(this.refs.pass)}
                        placeholder='email@email.com'
                        placeholderTextColor='rgb(206, 206, 206)'
                        keyboardType='email-address'
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.emailError && styles.errorText]}
                    />
                </Animatable.View>
            
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
                        onChangeText={store.onChangePass}
                        onFocus={store.onInputFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={()=> store.onSubmitPass(this.refs.passConfirm)}
                        placeholder='Password'
                        placeholderTextColor='rgb(206, 206, 206)'
                        returnKeyType='next'
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.passError && styles.errorText]}
                    />
                </Animatable.View>

                <Animatable.View 
                    style={[styles.pass, 
                        !this.state.showToS && { marginBottom: percentH(1.5)}]} 
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
                        onChangeText={store.onChangePassConfirm}
                        onFocus={store.onInputFocus}
                        onSubmitEditing={store.onSubmitPassConfirm}
                        blurOnSubmit={false}
                        placeholder='Confirm password'
                        placeholderTextColor='rgb(206, 206, 206)' 
                        secureTextEntry
                        underlineColorAndroid='transparent'
                        style={[styles.inputText, store.passConfirmError && styles.errorText]}
                    />
                </Animatable.View>

                { 
                this.state.showToS &&
                <View
                    style={styles.tosView}
                >
                    <Text style={[styles.tosText, {fontSize: percentW(3.9), color: 'rgb(255, 255, 255)' }]} >
                        By registering you accept our
                    </Text>

                    <TouchableOpacity 
                        onPress={store.onTosPress} 
                        disabled={loading}
                    >
                        <Text style={styles.tosText}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity>
                </View>                
                }


                    <View style={[styles.registerButton, loading && {backgroundColor: 'transparent'}]} >
                      {  loading ?
                        <Image 
                            style={{ height: percentH(5), alignSelf: 'center' }}
                            source={images['loader']}
                            resizeMode='contain'
                        />
                        :
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                            onPress={store.onRegisterPress}
                            disabled={loading}
                        >                        
                            <Text
                                style={{ color: 'rgb(255, 255, 255)', fontSize: percentW(5), fontWeight: '500'}}
                            >Register</Text>
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
}

const percentW = (num) => {
    return (width / 100) * num;
}

const styles = StyleSheet.create({
    container: {        
        // height: percentH(45),
        // flex: 1,
        height,
        width: percentW(74),
        alignSelf: 'center',
        // marginTop: percentH(20),
        // paddingBottom: percentH(0)
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
    userNameView : {
        // height: percentH(10),
        justifyContent: 'center',
        alignItems: 'center',
        // marginVertical: percentH(3),
        },
    userNameText: {
        alignSelf: 'center',            
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontStyle: 'italic',
        fontSize: percentW(5.6),
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
    image: {
        height: percentH(17),
        width: percentH(17),
        borderRadius: percentH(9),
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
        fontSize: percentW(5.6)
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
        fontSize: percentW(3.7), 
        color: 'rgb(76, 154, 100)'
    },
    error: {
        borderBottomColor: 'rgb(188, 0, 0)',
    },
    errorText: {
        color: 'rgb(188, 0, 0)',
    }
})