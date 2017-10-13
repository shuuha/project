import React, { Component } from 'react';
import { Animated, StyleSheet, View, Dimensions, Image } from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from './config';

export class Img extends React.Component {
  constructor(props) {
    super(props);

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this._pinchScale } }],
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
  }
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
  _onDragHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      console.log('dragging');
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };

    _onSingleTap = event => {      
        const { store } = this.props;
        if (event.nativeEvent.state === State.ACTIVE) {          
            if(store.canDeploy){
                let { x, y } = event.nativeEvent;
                store.addNewItemsOnBoard(x, y);
            }
            else 
                store.boardSelectClear();
    }
  }    

  render() {
    const { panIds, rotateIds, pinchIds } = this.props;
    return (
      <TapGestureHandler
        onHandlerStateChange={this._onSingleTap}
      >
      <PanGestureHandler
        id="image_tilt"
        onGestureEvent={this._onDragGestureEvent}
        onHandlerStateChange={this._onDragHandlerStateChange}
        // waitFor={'image_rotation'}
        // minPointers={2}
        // maxPointers={2}
        minDist={10}
        waitFor={panIds}
        
        >
        <RotationGestureHandler
          id="image_rotation"
          simultaneousHandlers="image_pinch"
          onGestureEvent={this._onRotateGestureEvent}
          onHandlerStateChange={this._onRotateHandlerStateChange}
          waitFor={rotateIds}
          >
          <PinchGestureHandler
            id="image_pinch"
            simultaneousHandlers="image_rotation"
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this._onPinchHandlerStateChange}
            waitFor={pinchIds}
            >

              <Animated.View
                style={[
                  styles.imageStyle,
                  {
                    transform: [
                      { perspective: 200 },
                      { scale: this._scale },
                      { rotate: this._rotateStr },
                      { translateX:  this._translateX },
                      { translateY:   this._translateY }
                    ],
                  },
                ]}
              >
                  <Image 
                    style={{ flex: 1, height: null, width: null/*position: 'absolute', height: Dimensions.get('window').height*/ }}
                    source={this.props.source}              
                  >                  
                    {this.props.children}                  
                  </Image>
              </Animated.View>            
          </PinchGestureHandler>
        </RotationGestureHandler>
      </PanGestureHandler>
      </TapGestureHandler>
    );
  }
}

const styles = StyleSheet.create({  
    imageStyle: {
        flex: 1,
        position: 'relative',
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width,
        zIndex: -100
        // width: null,
        // height: null
  }
});