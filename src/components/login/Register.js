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
    Vibration
    } from 'react-native';
import * as Animatable from 'react-native-animatable';
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

        this.props.store.register.refs = this.refs;
        this.props.store.register.Vibration = Vibration;
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
        const { 
            register : store, 
            register : { photos }, 
            loading, 
            errorText 
            } = this.props.store;
        return(
            <Animated.View             
                style={[
                    styles.container, { marginTop: this.state.top },
                    {opacity: this.animatedValue } 
                ]}
            >                
            <View style={styles.avatarView} >
                <TouchableWithoutFeedback
                    onPress={store.onAvatarPress}
                    disable={loading}
                >
                    <Image
                        style={[styles.avatar, photos.imageUri && styles.image]}
                        source={ photos.imageUri ? { uri: photos.imageUri} : images['camera']}
                        resizeMode = { photos.imageUri ? 'cover' : 'contain'}
                    />
                </TouchableWithoutFeedback> 
            </View>

                <View
                    style={[styles.userNameView, 
                        !this.state.showToS && {height: percentH(6), marginVertical: 0 } ]} > 
                    <Text style={styles.userNameText} >{ errorText ? '' : this.props.store.signUp.fullname}</Text>
                </View>


                <Animatable.View 
                    style={[styles.email]} 
                    duration={500}
                    animation={ store.emailError && store.shakeTrigger ? 'shake' : '' }
                    useNativeDriver={true}
                    onAnimationEnd={()=> store.shakeTrigger = false}
                >
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
                        ref={'email'}
                        value={store.email}
                        returnKeyType='next'
                        onChangeText={store.onChangeEmail}
                        onFocus={store.onInputFocus}
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
                        style={{ 
                            height: PixelRatio.getPixelSizeForLayoutSize(6),
                            width: PixelRatio.getPixelSizeForLayoutSize(6),
                            marginRight: 5
                        }}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput
                        editable={!loading}
                        ref={'pass'}
                        value={store.pass}
                        onChangeText={store.onChangePass}
                        onFocus={store.onInputFocus}
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
                        style={{ 
                            height: PixelRatio.getPixelSizeForLayoutSize(6),
                            width: PixelRatio.getPixelSizeForLayoutSize(6),
                            marginRight: 5
                        }}
                        source={images['lock']}
                        resizeMode='contain'
                    />
                    <TextInput
                        editable={!loading}
                        ref={'passConfirm'}
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
                    <Text style={[styles.tosText, {fontSize: 14, color: 'rgb(255, 255, 255)' }]} >
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
                                style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
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
        flex: 1,
        width: percentW(74),
        alignSelf: 'center',
        // marginTop: percentH(20),
        // paddingBottom: percentH(0)
        paddingHorizontal: percentW(5)
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
    },
    error: {
        borderBottomColor: 'rgb(188, 0, 0)',
    },
    errorText: {
        color: 'rgb(188, 0, 0)',
    }
})