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
    } from 'react-native';
import { observer, inject } from 'mobx-react';
import KeyEvent from 'react-native-keyevent';

const NUMBER_OF_INPUTS = [1, 2, 3, 4];

@inject('store')
@observer
export class ActivationCode extends Component{
    state = {
        top: percentH(10)
    }

    animatedView = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)
        this.refs.input0.focus();
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

    _keyboardDidShow = (e) => {
    // pushing the view up, the overall distance is calculated from : 
    // currentMarginTop - keyboardHeight + percent of (text + user field + login button)
    this.setState({ top: this.state.top - e.endCoordinates.height + percentH(28)})
    }

    _keyboardDidHide = () => {
        this.setState({ top: percentH(10)})
    }
    

    render(){
        const { 
            values,
            onInputChange,
            onChangeText,
            onSelectionChange,
            onEnter,
            onFocus
            } = this.props.store.activation;
        return(            
            <Animated.View style={[
                    styles.container, 
                    { opacity: this.animatedView }, 
                    { marginTop: this.state.top }
                ]} 
            >

                <Text
                    style={styles.text}
                >Enter activation code</Text>

                <View style={[styles.inputsContainer]} >
                    {
                       NUMBER_OF_INPUTS.map((q, i) => 
                            <View                        
                                key={i}
                                style={{ flex: 1, flexDirection: 'row', height: percentH(8)}}
                            >
                                <TextInput                                
                                    ref={`input${i}`}
                                    // onKeyPress={}
                                    keyboardType='numeric'
                                    underlineColorAndroid='transparent'
                                    value={values[i]}
                                    maxLength={1}
                                    onChange={(e)=> onInputChange(this.refs, i, e)}
                                    onChangeText={(e)=> onChangeText(e, i)}
                                    onSelectionChange={onSelectionChange}
                                    onFocus={()=> onFocus(i)}
                                    style={[styles.inputText, values[i] && { fontWeight: '500' }]}
                                />
                                <View
                                    style={{ flex: 0.2}}
                                >
                                </View>
                            </View>
                        )                        
                    }
                </View>
                <View style={styles.enterButton} >
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}                        
                        onPress={onEnter}
                    >
                        <Text
                            style={{ color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '500'}}
                        >Enter</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity

                >
                    <Text
                        style={[styles.text, { marginBottom: percentH(0), marginTop: percentH(15)} ]}
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
        height: percentH(45),
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
        marginBottom: percentH(3)
    },
    inputText: {        
        flex: 0.8,
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: 25, 
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid',
        textAlign: 'center'
    },
    text: {
        alignSelf: 'center',
        width: percentW(64),
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        fontFamily: 'Arial',
        fontSize: 20, 
        fontWeight: '500',
        marginBottom: percentH(2.5)
    },
    enterButton: {
        height: percentH(5.5),
        width: percentW(64),        
        borderRadius: 5,
        marginBottom: percentH(1.5),
        marginTop: percentH(1.5),
        backgroundColor: 'rgb(95, 188, 102)',
        
    },
})
