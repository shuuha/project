import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput,
    Image,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,    
    KeyboardAvoidingView
    } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height, width } = Dimensions.get('window');

export class Picture extends Component{
    render(){

        const { 
            source,            
            value, 
            onChangeText, 
            placeholder,
            onSubmitEditing,            
            inputStyle,            
            commentAbbr,
            editable,
            defaultValue,
            showTextInput,
            disabled,
            onPress,
            containerStyle,
            onLongPress,
            removeMode,
            checked
            } = this.props;            
        return(
            <TouchableWithoutFeedback
                disabled={disabled}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <View            
                    style={[styles.container, containerStyle]}
                >
                    <Image
                        style={styles.image}
                        source ={{ uri: source }}
                    />

                    { removeMode &&                    
                        <View
                            style={{ position: 'absolute', top: 10, left: 10}}
                        >                    
                            <Icon
                                name={ checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                size={30}
                                style={{ 
                                    backgroundColor: 'rgb(217, 219, 214)', 
                                    borderRadius: 5
                                }}

                            />
                        </View>
                    }

                    { showTextInput ? 
                        <KeyboardAvoidingView
                            behavior='padding'
                        >
                            <TextInput 
                                multiline={true}
                                autoCorrect={false}
                                value={value}
                                defaultValue={defaultValue}
                                onChangeText={onChangeText}
                                placeholder={placeholder}                    
                                onSubmitEditing={onSubmitEditing}                                
                                editable={editable}
                                underlineColorAndroid='transparent'
                                style={[styles.input, inputStyle]}
                            />
                        </KeyboardAvoidingView>
                        :
                        <Text>{commentAbbr}</Text>
                    }

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width / 2 - 10,
        height: height / 3,
        padding: 5,
        margin: 5
    },
    image: {
        flex: 1,
        marginBottom: 5
    },
    input: {
        fontSize: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgb(0, 0, 0)',
        height: 150
    }
})