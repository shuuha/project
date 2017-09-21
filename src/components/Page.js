import React, { Component } from 'react';
import { View, Text, BackHandler, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button, Input, Header, Icon, InputQuestion } from './common';
import { observer, inject } from 'mobx-react/native';



const {width, height } = Dimensions.get('window');

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
        console.log('render');
        const { headerTitle, buttonLabel, inputs, type,
                handleSubmit, navButtonEnabled, 
                inputsAreValid, nextPage, isActive } = this.props.page;
        return(
            <ScrollView >             
                <View   style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: height -30, 
                                alignItems: 'center',
                                justifyContent: 'space-between' }}>
                <Header
                    header={headerTitle}                    
                    disabled={!navButtonEnabled}
                    onPress={()=>this.props.store.goBack(this.props.history)}
                    /> 
                
                    <View  style={{ width }} >
                        
                        { type === 1 && inputs.map(i => <Input                       
                                                key={i.id}
                                                placeholder={i.placeholder}
                                                value={i.value}
                                                label={i.label}                                        
                                                onChangeText={(text)=> i.handleChange(text)}
                                                />)}
                        { type === 2 && inputs.map(i => <InputQuestion
                                                key={i.id}
                                                text={i.text}
                                                onPress={(e)=> i.handleYesNoPress(e)}
                                                isActive={i.isActive}
                                                />)}
                    </View>
                

                        

                {/*<InputQuestion 
                    text='what is your favorite color? The answer can be yes and no and not sure'
                    isActive={isActive}
                    onPress={this.handlePress.bind(this)}*/}


                {/*/>*/}

                <Button                    
                    label={buttonLabel}
                    disabled={!inputsAreValid}
                    onPress={()=>this.props.store.goForward(this.props.history, nextPage)}
                    />


                    <Text></Text>
                </View>
            </ScrollView>
          
        );
    }
}

export default Page;