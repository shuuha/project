import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class ErrorText extends Component{
    render(){
        const { errorText } = this.props.store;
        return(            
            <View
                style={{ 
                    position: 'absolute', 
                    top: '35%', 
                    width: '64%', 
                    alignSelf: 'center'
                }}
            >
                <Text
                    style={{ 
                        color: 'red', 
                        fontSize: 20, 
                        fontFamily: 'Arial',
                        textAlign: 'center'  
                    }}
                >{errorText}</Text>
            </View>
        );
    }
}