import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer, inject } from 'mobx-react';

const LICENSE_TYPES = ['a', 'b', 'c'];

@inject('store')
@observer
export class UserInfo extends Component{

    renderLicenseType = () => {
        const { store } = this.props;

        <View
            style={{ flexDirectin: 'row', padding: 10 }}
        >        
            <Text
                
            >Driver lisence</Text>
                <Icon 
                    name='checkbox-outline-blank'
                    size={ 30 }
                />
        </View>
    }

    render(){
        return(
            <View>


            </View>
        );
    }
}