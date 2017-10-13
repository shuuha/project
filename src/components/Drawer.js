import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';

import { observer } from 'mobx-react';

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
                <Img 
                    source={images['node']} 
                    panIds={store.panIds}
                    rotateIds={store.rotateIds}
                    pinchIds={store.pinchIds}
                    store={store}
                >               

                    { store.dynamicItems.map((q, i)=> 
                        <BoardItem
                            key={i}                            
                            name={q.name}
                            isSelectedOnBoard={q.isSelectedOnBoard}
                            hideItem={q.hideItem}
                            isHidden={q.isHidden}
                            panId={q.panId}
                            rotateId={q.rotateId}
                            pinchId={q.pinchId}
                            x = {q.x}
                            y = {q.y}
                            images={images}                            
                            store={store}
                        />
                    )}
                </Img>
               
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

