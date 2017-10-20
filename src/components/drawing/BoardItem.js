import React, { Component } from 'react';
import { observer } from 'mobx-react';
const UIManager = require('NativeModules').UIManager;
import { 
  Animated, 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity,
  findNodeHandle
} from 'react-native';

import {
  PanGestureHandler,  
  RotationGestureHandler,
  TapGestureHandler, 
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from './config';

import { Item } from './Item';

@observer
export class BoardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {      
      pan: new Animated.ValueXY(),
      lastOffset: { x: 0, y: 0}
    }

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [ { nativeEvent: { scale: this._pinchScale }}],      
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

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
    this._onDragGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this.state.pan.x,
            translationY: this.state.pan.y
          },          
        },        
      ],      
      { useNativeDriver: USE_NATIVE_DRIVER,
        listener: this.handleDrag }
    );

    this.translateX = this.state.pan.x.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 100]
    })

    //background style
    this._backgroundStyle = new Animated.Value(0);
    this.backStyle = this._backgroundStyle.interpolate({
      inputRange: [0, 100],
      outputRange: [2, 2],
    })
  }

  handleDrag= (event) => {    
    const { imageScale: scale } = this.props.store;    
    const valueX = this.state.pan.x._value / scale;
    const valueY = this.state.pan.y._value / scale;    
    this.state.pan.x.setValue(valueX);
    this.state.pan.y.setValue(valueY);
  }

  componentWillMount(){
      
      let { x, y } = this.props;
      x = x - 140 /2;
      y = y - 140 /2;
      this.state.pan.x.setOffset(x);
      this.state.pan.x.setValue(0);
      this.state.pan.y.setOffset(y);
      this.state.pan.y.setValue(0);
      this.state.lastOffset.x = x;
      this.state.lastOffset.y = y;      
  } 

  componentWillUnmount(){
    this.state.pan.removeAllListeners();
    this._onDragGestureEvent.removeListener();    
  }

  _onDragHandlerStateChange = event => {
      this.props.store.selectOnBoard(this.props.x);      

      if (event.nativeEvent.oldState === State.ACTIVE) {
        
      this.state.lastOffset.x += this.state.pan.x._value;
      this.state.lastOffset.y += this.state.pan.y._value;

      // this.state.lastOffset.x += event.nativeEvent.translationX;
      // this.state.lastOffset.y += event.nativeEvent.translationY;
          
      this._backgroundStyle.setOffset(this.state.lastOffset.x);

      this.state.pan.x.setOffset(this.state.lastOffset.x);
      this.state.pan.x.setValue(0);
      this.state.pan.y.setOffset(this.state.lastOffset.y);
      this.state.pan.y.setValue(0);

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

  _onPinchHandlerStateChange = event => {        
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };

    _onSingleTap = event => {      

    if (event.nativeEvent.state === State.ACTIVE) {      
      this.props.store.selectOnBoard(this.props.x);
    }
  }

  animatedTransform(){
      
    const temp =  { transform: [{ translateX: this.state.pan.x },
                                { translateY: this.state.pan.y },
                                { scale:      this._scale },
                                { perspective: 200 },
                                { rotate:     this._rotateStr }
                                ]};
    return temp;
  }  


  render() {   

    const { isSelectedOnBoard : enabled, panId, rotateId, pinchId } = this.props;    
        return (
                <TapGestureHandler
                  onHandlerStateChange={this._onSingleTap}
                  
                >
                   
              <PanGestureHandler                
                // enabled={ enabled }
                id={panId}
                onGestureEvent={this._onDragGestureEvent}
                onHandlerStateChange={this._onDragHandlerStateChange}
                >               
                 <RotationGestureHandler
                  id={rotateId}
                  simultaneousHandlers={pinchId}
                  onGestureEvent={ this._onRotateGestureEvent  }
                  onHandlerStateChange={ this._onRotateHandlerStateChange }
                  hitSlop={20}
                  
                >
                  <PinchGestureHandler
                    id={pinchId}
                    simultaneousHandlers={rotateId}
                    onGestureEvent={this._onPinchGestureEvent}
                    onHandlerStateChange={this._onPinchHandlerStateChange}
                    hitSlop={20}
                    >

                  <Animated.View
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
                      // refView={e => this.item = e}
                      name={this.props.name}
                      images={this.props.images}
                      style={{ backgroundColor:'transparent'}}
                    />
                  </Animated.View>
                  </PinchGestureHandler>
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