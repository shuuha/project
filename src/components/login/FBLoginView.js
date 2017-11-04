import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export class FBLoginView extends Component {
    render(){
        return (          
            <Icon.Button 
              onPress={this.props.onPress}
            // onPress={() => {
            //     if(!this.context.isLoggedIn){
            //       this.context.login()
            //     }else{
            //       this.context.logout()
            //     }
            //   }}
              color={"rgb(255, 255, 255)"}              
              name={"facebook"}  
              size={20} 
              borderRadius={5} 
              style={{ backgroundColor: 'rgb(59, 89, 152)', justifyContent: 'center'  }}
              >
                
                    <Text 
                      style={{ fontFamily: 'Arial', fontSize: 15, color: 'rgb(255, 255, 255)'}}
                    >Sign in with Facebook</Text>
                
            </Icon.Button>          
    );
  }
}