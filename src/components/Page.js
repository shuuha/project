import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { Button, Input, Header, Icon, InputQuestion } from './common';
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
        const { 
                headerTitle, 
                buttonLabel, 
                inputs, 
                type,
                handleSubmit, 
                navButtonEnabled, 
                inputsAreValid, 
                nextPage,                
                isActive 
            } = this.props.page;

        return(
            <ScrollView                 
                stickyHeaderIndices={[0]}
                    >            
                <Header                    
                    header={headerTitle}                    
                    disabled={!navButtonEnabled}
                    onPress={()=>this.props.store.goBack(this.props.history)}
                    />
            
                    <View 
                        style={{ 
                            flex: 1,                            
                            justifyContent: 'space-around',
                            alignItems: 'center'}}
                         >                        
                        { type === 1 && inputs.map(i => <Input                       
                                                key={i.id}
                                                placeholder={i.placeholder}
                                                value={i.value}
                                                label={i.label}
                                                maxLength={i.maxLength}
                                                onChangeText={(text)=> i.handleChange(text)}
                                                />)}
                        { type === 2 && inputs.map(i => <InputQuestion
                                                key={i.id}
                                                text={i.text}
                                                onPress={(e)=> i.handleYesNoPress(e)}
                                                isActive={i.isActive}
                                                />)}
                    </View>
                    
                    { !this.props.store.lastPage && 
                        <Text style={{color: 'red', fontSize: 25, alignSelf: 'center' }}> 
                            This is the last page</Text>}

                    <Button
                        label={buttonLabel}
                        disabled={!inputsAreValid}
                        onPress={()=>this.props.store.goForward(this.props.history, nextPage)}
                    />               
                
            </ScrollView>
        );
    }
}

export default Page;