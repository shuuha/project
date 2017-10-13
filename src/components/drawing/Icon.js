import React from 'react';
import { View } from 'react-native';

import IconFont from 'react-native-vector-icons/MaterialCommunityIcons';

export const Icon = ({ 
                onLayout, 
                refIcon, 
                style, 
                name,
                iconStyle 
                }) => {
    return(
        <View
            ref={refIcon}
            onLayout={onLayout}
            style={[{
                    borderRadius: 10,
                    position: 'absolute',
                    bottom: 0,
                    right: 0}, style]
                }>
            <IconFont                
                name={name} 
                style={[{ fontSize: 100 }, iconStyle]}
            />                
        </View>

    );
}