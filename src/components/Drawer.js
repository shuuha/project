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

    render(){        
        return (
        <View 
            style={{ 
                flex: 1, 
                height: null, 
                width: null,
                backgroundColor: 'rgb(46, 50, 56)'
            }}
        >
                <Img
                    source={images['node']}
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
                { store.showList &&
                        <ItemList 
                            store={store}
                            images={images}
                            onPressIn={store.hideOverlay}
                        />
                }
                </Img>                
                <Icon
                    refIcon={(el) => this.icon = el}
                    onLayout={(e)=>store.getDeleteIconPos(this.icon)}
                    name='delete-forever'
                    style={[{ zIndex: 1},
                        store.deleteButtonVisible ? { opacity: 1 } : { opacity: 0}
                        ]}
                    iconStyle={{ color: 'rgb(234, 242, 240)' }}
                />

                { store.showAddButton &&                     
                        <ButtonIcon                         
                            style={{ 
                                position: 'absolute', 
                                right: 0, 
                                zIndex: 1                            
                            }}
                            iconStyle={{ color: 'rgb(234, 242, 240)' }}
                            name='plus-circle'                            
                            onPressIn={store.showOverlay}
                        />
                }                
            </View>            
        );
    }
}                

