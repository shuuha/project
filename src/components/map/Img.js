import React, { Component } from 'react';
import { Animated, StyleSheet, View, Dimensions, Image  } from 'react-native';

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
      { useNativeDriver: USE_NATIVE_DRIVER,
        listener: this.onPinch }
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
      { useNativeDriver: USE_NATIVE_DRIVER,
        listener: this.onDrag }
    );    
  }


  componentWillMount(){
    console.log('component will mount');    
  }

  componentWillUpdate(){
    console.log('component will update');    
    this.offsetY = this._lastOffset.y;            // saving the last offset on every update
    this.offsetX = this._lastOffset.x;
  }

  componentWillUnmount(){
    this._translateX.removeAllListeners();
    this._translateY.removeAllListeners();
    this._onDragGestureEvent.removeListener();
  }


  onPinch = () => {                               // activity for zooming in and out till release
    const scaleLimit = this._lastScale * this._pinchScale._value;      // pinch_scale_value - how much been zoomed during the gesture
                                                                      //last_scale = the scale used the last time
    if(scaleLimit > 2.5){                         // the max limit for zooming in
      this._pinchScale.setValue(0);               // setting pinch to 0, stopping from zooming in
      this._baseScale.setValue(0);                // same, as the transform variable is derived from these two (this.scale = Animated.multiply(pinch, baseScale))
      this.pinchValue = 2.5;                      // variable for setting values from the pincher, need the value in the release phase
      this._lastScale = 1;                        // variable for tracking the value in the release phase
    }

    else if(scaleLimit < 1){                      // if zoomed out more than normal size, fit the obj to the window
      this._pinchScale.setValue(1);               // setting default values for using pinch after fitting
      this._baseScale.setValue(1);                // need to set the other animated value too
      this.pinchValue = 1;                        // default values for variables
      this._lastScale = 1;                        
      this._translateX.setOffset(0);              //setting new position for the obj, 
      this._translateX.setValue(0);               //reseting any saved dragging values
      this._translateY.setOffset(0);
      this._translateY.setValue(0);
      this._lastOffset.x = 0;                     // setting accumulator of values variable to 0 (defaulting)
      this._lastOffset.y = 0;
    }

    else {                                        // if zooming not more than scaleLimit (the first if statement)
      this.pinchValue = this._pinchScale._value;  // accumulation of the pinch values, used in the release phase 
    }    
  }

  onDrag = () => {                                      // all activity during dragging till release of the panresponder
    const { height, width } = this.item;
    const dragValueY = this._translateY._value;           //current value on dragging till the release
    const dragValueX = this._translateX._value;
    const scaledHeight = (height * this._lastScale) - height;     // calculating overall size (for instance when zooming out)
    const scaledWidth = (width * this._lastScale) - width;
    const top = (scaledHeight - this.offsetY) / 2 / this._lastScale;      // calculating the distance of the sides
    const bottom = -(scaledHeight + this.offsetY) / 2 / this._lastScale;  // to keep track of the zoomed size
    const right = (scaledWidth - this.offsetX) / 2 / this._lastScale;
    const left = -(scaledWidth + this.offsetX) / 2 / this._lastScale;




    if(dragValueY + this._lastOffset.y >= top){   // stop moving in a given direction if the end of the object is reached
        this._lastOffset.y = top;                       // refreshing the last coords
        this._translateY.setOffset(this._lastOffset.y);  // refreshing location of the object with new coords
        this._translateY.setValue(0);                    // turning off dragging
    }

    if(dragValueY + this._lastOffset.y <= bottom){
        this._lastOffset.y = bottom;
        this._translateY.setOffset(this._lastOffset.y);
        this._translateY.setValue(0);
    }

    if(dragValueX + this._lastOffset.x >= right){
        this._lastOffset.x = right;
        this._translateX.setOffset(this._lastOffset.x);
        this._translateX.setValue(0);
    }

    if(dragValueX + this._lastOffset.x <= left){
        this._lastOffset.x = left;
        this._translateX.setOffset(this._lastOffset.x);
        this._translateX.setValue(0);
    }    
  }

  _onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {      
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);      
    }
  };
  _onPinchHandlerStateChange = event => {               // release phase for pincher
    if (event.nativeEvent.oldState === State.ACTIVE){     
      this._lastScale *= this.pinchValue;               // every time after release saving the value of the last scale
      this._baseScale.setValue(this._lastScale);        // setting the value, saving the new zoomed position of the element
      this._pinchScale.setValue(1);                     // reseting the scale value, for future usage 

      this.props.store.imageScale = this._lastScale;    // saving the current value of scale to the store and using it in BoardItem component to make the components move correctly according to zoomed value
      this.forceUpdate();                               // updating after every release on zoom, to track the position of the object (see this.onDrag listener)
    }
  };

  _onDragHandlerStateChange = event => {                 // activity on drag release
    if (event.nativeEvent.oldState === State.ACTIVE) {  
        this._lastOffset.x += this._translateX._value;   // keeping the value of moved distance
        this._lastOffset.y += this._translateY._value;     
        this._translateX.setOffset(this._lastOffset.x);  //setting new position for the object with the last coords
        this._translateX.setValue(0);                    //clearing the coords accumulated by values
        this._translateY.setOffset(this._lastOffset.y);
        this._translateY.setValue(0);      
      
      }
  };

  onLayout = (e) =>{    
    this.item = e.nativeEvent.layout;
    this.forceUpdate();
  }

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
    console.log(this.props.store.resetImgPosition);
    const { panIds, rotateIds, pinchIds } = this.props.store;
    return (
      <TapGestureHandler
        onHandlerStateChange={this._onSingleTap}
      >
      <PanGestureHandler
        id="image_tilts"
        onGestureEvent={this._onDragGestureEvent}
        onHandlerStateChange={this._onDragHandlerStateChange}
        // waitFor={'image_rotation'}
        // minPointers={2}
        // maxPointers={2}
        minDist={10}
        waitFor={[...panIds, ...pinchIds]}
        
        >
{/*        <RotationGestureHandler
          id="image_rotation"
          simultaneousHandlers="image_pinch"
          onGestureEvent={this._onRotateGestureEvent}
          onHandlerStateChange={this._onRotateHandlerStateChange}
          waitFor={rotateIds}
          >*/}
          <PinchGestureHandler
            id="image_pinch"
            simultaneousHandlers="image_rotation"
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this._onPinchHandlerStateChange}
            waitFor={pinchIds}            
            >

              <Animated.View                
                ref={(e)=> this.item = e}
                onLayout={this.onLayout}
                style={[
                  styles.imageStyle,
                  {
                    transform: [
                      { perspective: 1000 },
                      { scale: this._scale },
                      { rotate: this._rotateStr },
                      { translateX:  this._translateX },
                      { translateY:   this._translateY }
                    ],
                  },
                ]}
              >
                  <Image 
                    style={{ flex: 1, height: null, width: null, position: 'relative'}}
                    source={this.props.source}              
                  >                  
                    {this.props.children}
                  </Image>
              </Animated.View>
          </PinchGestureHandler>
        {/*</RotationGestureHandler>*/}
      </PanGestureHandler>
      </TapGestureHandler>
    );
  }
}

const styles = StyleSheet.create({  
    imageStyle: {
        flex: 1,
        // position: 'absolute',
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width,
        zIndex: -100
      }
});