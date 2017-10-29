import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';

import { observer, inject } from 'mobx-react';

import { ItemList, BoardItem, Icon, ButtonIcon, images } from '../drawing';
import { Img } from '../map';

@inject( stores => ({
  'drawingStore': stores.drawingStore,
  'mapStore': stores.mapStore
}))
@observer
export class DrawerMain extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.drawingStore.backHandler());        
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=>this.props.drawingStore.backHandler());
    }

    render(){
        const { drawingStore : store, mapStore } = this.props;        
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
                    source={{uri: mapStore.mapUri}}                    
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
                        style={[{ zIndex: 1 },
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

