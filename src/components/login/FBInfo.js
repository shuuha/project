import React, { Component } from 'react';
import { View, Text } from 'react-native';
import _ from 'lodash';

import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class FBInfo extends Component{
    render(){
        let data = this.props.store.fbInfo.data.profile;
        data = JSON.parse(data);
        const { name, gender, id, verified } = data;
        return(
            <View
                style={{ width: '70%', alignSelf: 'center'}}
            >
                <Text
                    style={{ color: 'white'}}
                >id: {id}</Text>
                <Text
                    style={{ color: 'white'}}
                >name: {name}</Text>
                <Text
                    style={{ color: 'white'}}
                >gender: {gender}</Text>
                <Text
                    style={{ color: 'white'}}
                >verified: {verified}</Text>
            </View>
        );
    }
}