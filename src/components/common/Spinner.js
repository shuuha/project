import React from 'react';
import { View, ActivityIndicator, Dimensions  } from 'react-native';

export const Spinner =({style}) => {
        return(
            <View style={[{
                            height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            }, style]} >

                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }} >
                    <ActivityIndicator
                    size={60}
                    />
                </View>
            </View>
    );
}