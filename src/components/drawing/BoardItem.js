import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  Animated, 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity  
} from 'react-native';

import {
  PanGestureHandler,  
  RotationGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from './config';

import { Item } from './Item';

@observer
export class BoardItem extends React.Component {
  constructor(props) {
    super(props);  

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    /*draggable*/    
    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);
    this._lastOffset = { x: 0, y: 0 };
    this._onDragGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY            
          },          
        },        
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    //background style
    this._backgroundStyle = new Animated.Value(0);
    this.backStyle = this._backgroundStyle.interpolate({
      inputRange: [0, 100],
      outputRange: [2, 2],
    })    
  }

  componentWillMount(){    
      let { x, y } = this.props;
      x = x - 140 /2;
      y = y - 140 /2;
      this._translateX.setOffset(x);
      this._translateX.setValue(0);
      this._translateY.setOffset(y);
      this._translateY.setValue(0);
      this._lastOffset.x = x;
      this._lastOffset.y = y;
  }

  _onDragHandlerStateChange = event => {
      
      this.props.store.selectOnBoard(this.props.x);
      if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;      
      this._backgroundStyle.setOffset(this._lastOffset.x);
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);

      const { absoluteX : x, absoluteY : y } = event.nativeEvent;
      const { pageX : dropX,  pageY  : dropY} = this.props.store.deleteIconPos;
      if( dropX < x && dropY < y){             
        this.props.hideItem();
        }
    }      
  };

  _onRotateHandlerStateChange = event => {    
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;      
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };

    _onSingleTap = event => {            
    if (event.nativeEvent.state === State.ACTIVE) {
      this.props.store.selectOnBoard(this.props.x);      
    }
  }

  animatedTransform(){    
    const temp =  { transform: [{ translateX:  this._translateX },
                                { translateY:   this._translateY },
                                { perspective: 200 },
                                { rotate: this._rotateStr }
                                ]};
    return temp;  
  }

  getItemSize = (e) => {
    this.size = e.nativeEvent.layout;
  }    

  render() {        
    const { isSelectedOnBoard : enabled } = this.props;        
        return (
                <TapGestureHandler
                  onHandlerStateChange={this._onSingleTap}
                >

              <PanGestureHandler                
                // enabled={ enabled }
                onGestureEvent={this._onDragGestureEvent}
                onHandlerStateChange={this._onDragHandlerStateChange}
                >               
                 <RotationGestureHandler
                  onGestureEvent={ this._onRotateGestureEvent  }
                  onHandlerStateChange={ this._onRotateHandlerStateChange }
                  hitSlop={20}
                  
                >
                  <Animated.View                      
                      onLayout={this.getItemSize.bind(this)}                      
                      style={[styles.box, this.animatedTransform(), 
                              { borderRadius: 100, 
                                borderStyle: 'dashed', 
                                borderColor: 'blue',
                                height: 140,
                                width: 140,
                                alignItems: 'center',
                                justifyContent: 'center'
                              },
                        enabled && { 
                          zIndex: 300,                                 
                          borderWidth: this.backStyle
                        },
                        this.props.isHidden && {display: 'none'} 
                        ]}
                  >
                    <Item
                      refView={ el => this.item = el}                      
                      name={this.props.name}
                      images={this.props.images}
                      style={{ backgroundColor:'transparent'}}
                    />
                  </Animated.View>
                </RotationGestureHandler>
              </PanGestureHandler>          
            </TapGestureHandler>
    );    
  }
}

const styles = StyleSheet.create({  
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'    
  }
});