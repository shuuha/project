import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet
} from 'react-native';

import { Item } from './Item'

import { observer } from 'mobx-react';

import { drawStore } from './drawStore';


@observer
export class ItemList extends Component{       
    
    render(){
        return(
            <ScrollView
                onLayout={this.props.onLayout}
                style={[{ height: 150}, this.props.style]}
                horizontal={true}
                contentContainerStyle={{ 
                    backgroundColor: 'white', 
                    justifyContent: 'center', 
                    alignItems: 'center'                    
                }}
            >          
            { drawStore.staticItems.map(q => <Item 
                                        style={[{ 
                                                marginHorizontal: 7,
                                                borderStyle: 'dashed',
                                                borderRadius: 5,
                                                borderColor: 'blue',                                                
                                         },
                                            q.isSelected && {
                                                borderWidth: 2,
                                                marginHorizontal: 5
                                                
                                        }]}
                                        key={q.id} 
                                        name={q.name}
                                        // isSelected={q.isSelected}
                                        onPress={()=> drawStore.changeSelected(q.id) } />)}
            </ScrollView>
        );
    }
}