import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

import {
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { DrawItem, MapImage, ItemList, drawStore } from './common/drawOnMap';

@observer
export default class Drawer extends Component{
    
    state = {
        itemListHeight: null
    }    

    getItemListHeight(e){
        console.log(e.nativeEvent);
            this.setState({ itemListHeight: e.nativeEvent.layout.height})
    }

    _onSingleTap = event => {
        if (event.nativeEvent.state === State.ACTIVE) {
            if(drawStore.canDeploy){
                let { x, y } = event.nativeEvent;
                drawStore.addNewItemsOnBoard(x, y);
            }
            else 
                drawStore.boardSelectClear();
    }
}

    render(){        
        return(
        <View style={{ height: Dimensions.get('window').height }} >
            <View>
                <ItemList
                    //  onLayout={this.getItemListHeight.bind(this)} 
                    //  style={{ height: this.state.itemListHeight }}
                />
             </View>
             
            <TapGestureHandler
                onHandlerStateChange={this._onSingleTap}
            >
                <View style = {{ flex: 1 }} >
                { drawStore.dynamicItems.map((q, i)=> 
                    <DrawItem
                        key={i}
                        name={q.name}
                        isSelected={q.isSelected}
                        isSelectedOnBoard={q.isSelectedOnBoard}
                        onBoardSelect={drawStore.onBoardSelect}
                        x = {q.x}
                        y = {q.y}
                        isCreated = {q.isCreated}
                        changeCreated={q.changeCreated}

                    />
                )}
                </View>
            </TapGestureHandler>
                <View style={styles.deleteStyle} >
                    <Text> Delete </Text>
                </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    deleteStyle: {
        position: 'absolute',
        backgroundColor: 'black',
        bottom: 0,
        right: 0,
        width: 100,
        height: 100
    },
    deleteTextStyle: {
        color: 'white',
        fontSize: 25
    }
})