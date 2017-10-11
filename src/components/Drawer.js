import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Dimensions, 
    StyleSheet, 
    BackHandler, 
    Image,
    TouchableOpacity 
} from 'react-native';
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


    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> drawStore.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=>drawStore.backHandler());
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
        console.log(drawStore.mapUri);
        console.log(this.state.itemListHeight)
        return(
             
            <Image
                style={{
                backgroundColor: '#ccc',
                flex: 1,
                resizeMode:'cover',
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                zIndex: -10
                }}

                source={{ uri: drawStore.mapUri }}
            >
        <View style={{ height: Dimensions.get('window').height }} >

            
            <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                <ItemList
                    //  onLayout={this.getItemListHeight.bind(tshis)} 
                     style={{ height: this.state.itemListHeight }}
                />
             </View>
             {/*<View style={{ height: 30 }} >
                <TouchableOpacity
                    onPress={()=> drawStore.showScroll = !drawStore.showScroll}                    
                >
                    <Text style={{ fontSize: 30, color: 'white', margin: 15 }} >{ !drawStore.showScroll ? 'show icons' : 'hide icons' }</Text>
                </TouchableOpacity>
             </View>*/}
                <TapGestureHandler
                    onHandlerStateChange={this._onSingleTap}
                >
                    <View                      
                        style={{ flex: 1 }}
                    >
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
        </View>
            </Image>
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