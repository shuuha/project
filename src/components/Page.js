import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native';
import { Button, Input, Header, InputConfirm } from './common';
import { observer, inject } from 'mobx-react/native';


@inject('store')
@observer
class Page extends Component{

    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.store.BackHandler(this.props.history));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=> this.props.store.BackHandler(this.props.history));
    }
    
    render(){        
        const { headerTitle, buttonLabel, inputs, 
                handleSubmit, navButtonEnabled, 
                inputsAreValid, nextPage } = this.props.page;                
        return(
            <View>
                <Header
                    header={headerTitle}                    
                    disabled={!navButtonEnabled}
                    onPress={()=>this.props.store.goBack(this.props.history)}
                    /> 

                { inputs.map(input => <Input
                                        key={input.id}
                                        {...input}
                                        onChangeText={(text)=> input.handleChange(text)}  />)}                   

                <Button
                    label={buttonLabel}
                    disabled={!inputsAreValid}                    
                    onPress={()=>this.props.store.goForward(this.props.history, nextPage)}
                    />
            </View>
        );
    }
}

export default Page;