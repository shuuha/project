import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    Dimensions    
} from 'react-native';

import { Item, ButtonIcon } from '../drawing'
import { observer } from 'mobx-react';

@observer
export class ItemList extends Component{
    
    render(){        
        const { height, width } = Dimensions.get('window');
        return(
            <ScrollView 
                contentContainerStyle={{                                         
                                        height,
                                        width,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',      
                                        backgroundColor: 'rgba(47, 48, 46, 0.8)',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        // alignContent: 'space-between'
                                    }}
            >   
                                        <View style={{ width }}>
                                            <ButtonIcon 
                                                name='close-circle'
                                                style={{ width: 100 }}
                                                iconStyle={{ color: 'rgb(247, 247, 247)' }}
                                                onPressIn={this.props.onPressIn}
                                            />
                                        </View>

            { this.props.store.staticItems.map(q => 
                                <View 
                                    style={{ height: 150, width: 100}}
                                    key={q.id} 
                                >

                                    <Item 
                                        key={q.id} 
                                        style={[{ 
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginHorizontal: 7,
                                                borderStyle: 'dashed',
                                                borderRadius: 5,
                                                borderColor: 'blue',
                                                backgroundColor: 'transparent'
                                         },
                                            q.isSelected && {
                                                borderWidth: 2,
                                                marginHorizontal: 5
                                                
                                        }]}
                                        onPressIn={(e)=> this.props.store.changeSelected(q.id, e) } 
                                        name={q.name}                                        
                                        refView={this.props.refView}
                                        images={this.props.images}
                                        />
                                </View>
                                        )}                                      
                                       
                                        
            </ScrollView>
        );
    }
}