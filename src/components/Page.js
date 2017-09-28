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

import { Header, Button, InputQ } from './common';
import InputsText from './InputsText';

const { width, height } = Dimensions.get('window');


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



    renderInputQuestion(){
                const { 
                    history,
                    page: { 
                        nextPage, 
                        inputs, 
                        isActive 
                    }} = this.props;
                
        
        return(
                <GestureRecognizer
                    onSwipeLeft={ ()=> this.props.page.swipeRightOrLeft(history, nextPage, 1) } // 1 for true 
                    onSwipeRight={()=> this.props.page.swipeRightOrLeft(history, nextPage, 0) }    // 0 for false
                    style={{ height, flex: 1, alignItems: 'center', backgroundColor: 'rgb(255, 255, 255)' }}>            
                
                    { inputs.map(i => <InputQ  key={i.id}
                                                text={i.text}
                                                onPress={(e)=> i.handleYesNoPress(history, nextPage, e)}
                                                isActive={isActive}
                                        /> )}
                </GestureRecognizer>           
        );
    }

    renderButton(){
            const { buttonLabel, inputsAreValid, nextPage } = this.props.page;
            
        return(
            <View>
                { !this.props.store.lastPage && 
                    <Text style={{color: 'red', fontSize: 25, alignSelf: 'center' }}> 
                            This is the last page</Text>}

                <Button
                    label={buttonLabel}
                    disabled={!inputsAreValid}
                    onPress={()=>this.props.store.goForward(this.props.history, nextPage)}
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

        return(
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
                    onPress={()=>this.props.store.goBack(this.props.history)}
                    />
                        
                        { type === 1 && <InputsText page={this.props.page} 
                                                history={this.props.history} 
                                                nextPage={nextPage} 
                                                currentPage={currentPage}
                                                />
                                            }

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

export default Page;