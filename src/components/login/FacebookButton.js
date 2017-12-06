import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const FacebookButton = (props) => {
    return(
            <Icon.Button 
              onPress={ props.disabled ? null : props.onPress}
              color={"rgb(255, 255, 255)"}
              name={"facebook"}
              size={20}
              borderRadius={5}
              style={[{ backgroundColor: 'rgb(59, 89, 152)', justifyContent: 'center' }, props.style]}
              >
                <Text 
                    style={[{ 
                        fontFamily: 'Arial', 
                        fontSize: 15,
                        color: 'rgb(255, 255, 255)'
                    }, props.textStyle]}                
                >Sign in with Facebook</Text>                
            </Icon.Button>
    );
}