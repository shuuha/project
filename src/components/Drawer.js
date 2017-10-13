import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';

import { observer } from 'mobx-react';
import { TapGestureHandler, State} from 'react-native-gesture-handler';

import { ItemList, BoardItem, Icon, ButtonIcon, images } from './drawing';
import { Img } from './map';

import { drawingStore as store } from '../stores/DrawingStore';
import { mapStore } from '../stores/MapStore';

@observer
export class Drawer extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> store.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=>store.backHandler());
    }    

    _onSingleTap = event => {
        if (event.nativeEvent.state === State.ACTIVE) {            
            if(store.canDeploy){
                let { x, y } = event.nativeEvent;
                store.addNewItemsOnBoard(x, y);
            }
            else 
                store.boardSelectClear();
    }
}    

    render(){        
        return(        
        <View style={{ flex: 1 }} >            
            <TapGestureHandler                    
                onHandlerStateChange={this._onSingleTap}                    
            >
                <View
                    style={{ flex: 1 }}
                >

                <Img source={{ uri: mapStore.mapUri}} />

                    { store.dynamicItems.map((q, i)=> 
                        <BoardItem
                            key={i}
                            name={q.name}
                            images={images}
                            isSelected={q.isSelected}
                            isSelectedOnBoard={q.isSelectedOnBoard}                            
                            changeCreated={q.changeCreated}
                            hideItem={q.hideItem}
                            isHidden={q.isHidden}
                            x = {q.x}
                            y = {q.y}
                            store={store}                            
                        />
                    )}
                </View>

                </TapGestureHandler>
               
                <Icon
                    refIcon={(el) => this.icon = el}
                    onLayout={(e)=>store.getDeleteIconPos(this.icon)}
                    name='delete-forever'
                    style={{ zIndex: 1}}
                    iconStyle={{ color: 'rgb(234, 242, 240)' }}
                />

                { store.showList &&
                    <View style={{ position: 'absolute', zIndex: 4 }} >
                        <ItemList 
                            store={store}
                            images={images}
                            onPressIn={store.hideItemsList}
                        />
                    </View>
                }
                { store.showAddButton &&                     
                        <ButtonIcon                         
                            style={{ 
                                position: 'absolute', 
                                right: 0, 
                                zIndex: 1                            
                            }}
                            iconStyle={{ color: 'rgb(234, 242, 240)' }}
                            name='plus-circle'                            
                            onPressIn={store.showItemsList}
                        />                    
                }                
            </View>            
        );
    }
}                

