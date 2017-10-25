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

    state = {
        buttonSize: {}
    }

    getButtonSize = (e) => {
        this.setState({ buttonSize: e.nativeEvent.layout })
    }

    render(){
        const { height, width } = Dimensions.get('window');
        const { imageScale : scale } = this.props.store;
        const scaledHeight = height / scale + 20;
        const scaledWidth = width / scale + 20;        
        const heightDiff = (height * scale - height ) / 2 / scale;
        const widthDiff = (width * scale - width) / 2 / scale;
        const bottom = this.props.store.translateY + heightDiff - 10;
        const right = this.props.store.translateX + widthDiff - 10;
        console.log(this.state.buttonSize, scaledHeight);
        
        return(
            <ScrollView
                style={[{
                    backgroundColor: 'rgba(47, 48, 46, 0.8)',
                    },
                    this.props.store.anySelected && { backgroundColor: 'transparent'}
                ]}
                // stickyHeaderIndices={[0]}
                scrollEnabled={false}
                contentContainerStyle={[{                                        
                                        height: scaledHeight,
                                        width: scaledWidth,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',                                        
                                        justifyContent: 'space-around',
                                        alignContent: 'flex-start',
                                        position: 'absolute',
                                        bottom,
                                        right
                                        },
                                    ]}            
            >
                                        <View 
                                            onLayout={this.getButtonSize}
                                        style={[{ 
                                                width,                                                 
                                                position: 'absolute',
                                                top: 30,
                                                left: 10
                                            },
                                                this.props.store.hideCloseButton && 
                                                { opacity: 0 }]
                                            }>
                                            <ButtonIcon                                                
                                                name='close-circle'
                                                style={{ width: scaledWidth / 3.5 }}
                                                iconStyle={{ 
                                                    color: 'rgb(247, 247, 247)',
                                                    fontSize: scaledHeight / 6
                                                }}
                                                onPressIn={this.props.onPressIn}
                                            />                                            
                                        </View>

                                        <View
                                            style={{ 
                                                height: this.state.buttonSize.height, 
                                                width,
                                                marginBottom: 5 * scale
                                             }}
                                        >
                                        </View>

            { this.props.store.staticItems.map(q=> 
                                    <Item
                                        store={this.props.store}
                                        key={q.id}
                                        id={q.id}
                                        dragActive={q.dragActive}
                                        isSelected={q.isSelected}                                        
                                        style={[{},
                                            q.isHidden == true && { opacity: 0 }]}                                        
                                        name={q.name}                                        
                                        images={this.props.images}
                                    />
                                    )}
            </ScrollView>
        );
    }
}