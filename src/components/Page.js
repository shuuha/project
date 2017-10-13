import React, { Component } from 'react';
import { View, 
        Text, 
        ScrollView, 
        StyleSheet, 
        BackHandler, 
        Dimensions,
        Keyboard,
        KeyboardAvoidingView
    } from 'react-native';

import { observer, inject } from 'mobx-react/native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import { Header, Button, InputQ, Spinner, ModalView } from './common';
import InputsText from './InputsText';

const { width, height } = Dimensions.get('window');


@inject('store')
@observer
export class Page extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }



    renderInputQuestion(){
                const { inputs, isActive } = this.props.page;

        return(
            inputs.map(i =>
                <GestureRecognizer
                    key={i.id}
                    onSwipeLeft={  ()=> i.swipeRightOrLeft(true) } 
                    onSwipeRight={ ()=> i.swipeRightOrLeft(false) }
                    style={{ height, flex: 1, alignItems: 'center', backgroundColor: 'rgb(255, 255, 255)' }}>
                
                     <InputQ   label={i.label}
                               onPress={(e)=> i.handleYesNoPress(e)}                                                
                               value={i.value}
                               inputRef={(el) => this.input = el }
                               /> 
                </GestureRecognizer>
            )
        );
    }

    renderButton(){
            const { buttonLabel, inputsAreValid } = this.props.page;
            
        return(
            <View>
                { /*!this.props.store.lastPage && 
                    <Text style={{color: 'red', fontSize: 25, alignSelf: 'center' }}> 
                            This is the last page</Text>*/}

                {
                    /*!this.props.store.loaded && 
                        <Text style={{ color: 'red', fontSize: 30, textAlign: 'center' }} 
                            > Unable to send the data, check your internet connection </Text>*/
                }

                <Button
                    label={buttonLabel}
                    disabled={!inputsAreValid}
                    onPress={()=>this.props.page.goForward()}
                />
            </View>
        )
    }   

    render(){
        const { 
            headerTitle, 
            navButtonEnabled, 
            type, 
            nextPage,
            keyboard,
            inputsAreValid,
            swipeLeft,
            swipeRight,
            currentPage
        } = this.props.page;

        const { loading, modalVisible } = this.props.store;
        
        return(
            loading ? <Spinner /> :

            <ScrollView
                // style={{ height }}
                contentContainerStyle={{
                                    height,
                                    justifyContent: 'space-between' }}                
                scrollEnabled={ type === 1 }
                stickyHeaderIndices={[0]} 
                keyboardShouldPersistTaps='always'
                >
            
                <Header
                    header={headerTitle}
                    disabled={!navButtonEnabled}
                    onPress={()=>this.props.store.goBack()}
                    />                      
                        
                            { modalVisible && <ModalView /> }

                            { type === 1 && <InputsText page={this.props.page}                                                
                                                    /> }
                            <KeyboardAvoidingView 
                                    behavior='padding' 
                            > 
                                    { type === 1 && this.renderButton() }

                            </KeyboardAvoidingView>

                            { type === 2 && this.renderInputQuestion()}
                        
        </ScrollView>
        );
    }
}