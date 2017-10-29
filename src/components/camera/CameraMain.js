import React, { Component } from 'react';
import { 
    ScrollView, 
    Text, 
    View, 
    Platform,
    BackHandler,
    } from 'react-native';
import { observer, inject } from 'mobx-react';

import { Picture } from './Picture';
import { Header } from '../common';

@inject('store')
@observer
export class CameraMain extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    render(){
        const { store } = this.props;
        return(
            <ScrollView
                stickyHeaderIndices={[0]}
                // contentContainerStyle={ flexDirection: 'row', alignItems: 'flex-start' }
            >
                <Header 
                    header={store.title}
                    nameRight={store.removeMode ? 'delete-forever' : 'ios-camera'}
                    sizeRight={60}
                    onRightIconPress={store.headerRightButtonPress}
                />

                <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}
                >
                {
                    store.picturesList.map((q, i) =>
                        <Picture
                            key={i}
                            source={q.photo}
                            checked={q.checked}
                            onPress={q.handlePress}
                            commentAbbr={q.commentAbbr}
                            showTextInput={false}
                            removeMode={store.removeMode}
                            onLongPress={store.handleLongPress}
                        />
                )}
                </View>
            </ScrollView>
        );
    }
}
