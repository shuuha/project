import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Image } from 'react-native';

import images from './assets';

export class  Item extends Component{
    render(){
     const {onPress, name, isSelected, style, refView } = this.props;
        return(
            <View
                ref={refView}
                style={[{ backgroundColor: 'rgb(255, 255, 255)', }, style]}
                >
                <TouchableWithoutFeedback
                    onPress={onPress}
                >
                    <Image
                        style={{ margin: 10 }}
                        source={ !isSelected ? images[name] : images[name + '-selected'] || images[name] }                        
                    />
                </TouchableWithoutFeedback>
            </View>            
        
        );
    }
}