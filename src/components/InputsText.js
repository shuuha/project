import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {  Input } from './common';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
class InputsText extends Component{
    // constructor(props){
    //     super(props);

        
    // }

    render(){        
        // const { appStore: store, pageStore } = this.store;
        // console.log(store, pageStore);

        const { store, page } = this.props;       

        return(            
            <View >
                {
                    page.inputs.map(i => <Input  key={i.id}
                        placeholder={i.placeholder}
                        value={i.value}
                        label={i.label}
                        maxLength={i.maxLength}
                        onChangeText={(text)=> i.handleChange(text)}
                        onSubmitEditing={ ()=> i.onSubmitEditing()}
                        /> )}
            </View>
        );
    }
}

export default InputsText;