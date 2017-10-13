import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import IconFont from 'react-native-vector-icons/MaterialCommunityIcons';

export const ButtonIcon = ({                 
                style, 
                name,
                onPress,
                iconStyle,
                onPressIn
                }) => {
    return(
           <TouchableOpacity
                    style={style}
                    onPress={onPress}
                    onPressIn={onPressIn}
            >

           <IconFont                
                name={name} 
                style={[{ fontSize: 100 }, iconStyle]}
           />                

           </TouchableOpacity>
    );
}