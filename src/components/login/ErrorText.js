import React, { Component } from 'react';
import { 
    View, 
    Text,
    Animated
} from 'react-native';

import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class ErrorText extends Component{

    animatedOpacity = new Animated.Value(0);

    render(){
        const { errorText} = this.props.store;

        if(errorText){
            Animated.timing(this.animatedOpacity,{
                toValue: 1,
                duration: 500
            }).start();
        }
        return(
            errorText &&
            <Animated.View
                style={[{ 
                    position: 'absolute', 
                    top: '35%', 
                    width: '64%', 
                    alignSelf: 'center',
                    zIndex: 1,
                    opacity: this.animatedOpacity
                }]}
            >
                <Text
                    style={{ 
                        color: 'red',
                        fontSize: 20, 
                        fontFamily: 'Arial',
                        textAlign: 'center'  
                    }}
                >{errorText}</Text>
            </Animated.View>
        );
    }
}