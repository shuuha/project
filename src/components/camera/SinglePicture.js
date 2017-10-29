import React, { Component } from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Platform,
    BackHandler,
    Dimensions    
    } from 'react-native';
import { observer, inject } from 'mobx-react';

import { Picture } from './Picture';
import { Header } from '../common';

const { height, width } = Dimensions.get('window');

@inject('store')
@observer
export class SinglePicture extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    render(){
        const { id }  = this.props.match.params;
        const picStore = this.props.store.picturesList.find(q => q.id == id);

        return(
            <ScrollView
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ width, height }}
            >
                <Header 
                    header={picStore.cameraStore.title}
                    nameRight='delete-forever'
                    sizeRight={60}
                    onPress={picStore.cameraStore.goBack}
                    onRightIconPress={()=> picStore.cameraStore.removeSinglePicture(picStore.id)}
                />

                <Picture                
                    source={picStore.photo}
                    value={picStore.value}
                    onChangeText={picStore.changeValue}
                    placeholder='Enter a comment'
                    onSubmitEditing={picStore.onSubmitEditing}
                    showTextInput = {true}
                    containerStyle={styles.picture}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    picture: {
        height: '80%',
        width: null,
        flex: 1,
    }
})