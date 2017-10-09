import React, { Component } from 'react';
import { Alert, Animated, StyleSheet, View, Text, Dimensions, TouchableOpacity  } from 'react-native';

import {
  PanGestureHandler,  
  RotationGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from './config';

import { Item } from './Item';

export class DrawItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showItem: false,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,      
      size: {}
    }    

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

  _onDragHandlerStateChange = event => {      
      const { x, y } = event.nativeEvent;      
      // console.log(x, y);
      const middleX = this.size.width/2;
      const xSideLength = middleX/2;
      const middleY = this.size.height/2;
      const ySideLength = middleY/2;

      this.setState({
        top: middleY - ySideLength,
        bottom: middleY + ySideLength,
        left: middleX - xSideLength,
        right: middleX + xSideLength,
      })
      const { top, bottom, left, right } = this.state;

      let isOuter = false;
          isOuter = top > y || bottom < y || left > x || right < x;

          let another = 35 > y || 105 < y || 35 > x || 105 < x; 

      if(another){
      // console.log(x, 'outer', another)
      // this._lastRotate += 0.2;      
      // this._rotate.setOffset(this._lastRotate);
      // this._rotate.setValue(0);      
  

      // this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      // this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
      }

      else if (event.nativeEvent.oldState === State.ACTIVE) {
      // console.log('inner')
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;      
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }

  };

  _onRotateHandlerStateChange = event => {
    console.log(event);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      console.log('rotation: ', event.nativeEvent.rotation)
      console.log(this._lastRotate);
      console.log(this._rotate);
      console.log(this._translateX);
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };

    _onSingleTap = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // let { x, y } = event.nativeEvent;      
      //   this.setState({ showItem: true})
        // x = x - this.size.width /2;
        // y = y - this.size.height /2;
      //   this._translateX.setOffset(x);
      //   this._translateX.setValue(0);
      //   this._translateY.setOffset(y);
      //   this._translateY.setValue(0);
      //   this._lastOffset.x = x;
      //   this._lastOffset.y = y;
      


      // this.item.getNode().measure((x, y, width, height, px, py) => {
      //               this.itemX = px + width/2;
      //               this.itemY = py + height/2;
      //               this.posX = width; this.posY = height;
      //               console.log(this.itemX, this.itemY);
      //               console.log(x, y, width, height, px, py)});
    }
  }

  animatedTransform(){    
    const temp =  { transform: [{ translateX:  this._translateX },
                                { translateY:   this._translateY },
                                { perspective: 200 },
                                { rotate: this._rotateStr }]};
    return temp;  
  }

  getItemSize = (e) => {
    this.size = e.nativeEvent.layout;
  }
    

  render() {    
    return (
          <TapGestureHandler          
            onHandlerStateChange={this._onSingleTap}
            // enabled={this.state.showItem ? false : true}
            >          
              <PanGestureHandler                
                onGestureEvent={this._onDragGestureEvent}
                onHandlerStateChange={this._onDragHandlerStateChange}                
                >               

                <RotationGestureHandler
                  onGestureEvent={this._onRotateGestureEvent}
                  onHandlerStateChange={this._onRotateHandlerStateChange}                  
            >

                  <Animated.View
                      ref={ el => this.item = el}                      
                      onLayout={this.getItemSize.bind(this)}                      
                      style={[styles.box, this.animatedTransform(), 
                        !this.state.showItem ? {opacity: 1} : {opacity: 0}
                         ]}
                  >                  
                    <Item
                      // styles={styles.box}
                      name={this.props.name}
                      isSelected={this.props.isSelected}
                      styles={{ padding: 20, 
                                borderWidth: 1, 
                                borderRadius: 100, 
                                borderStyle: 'dashed', 
                                borderColor: 'blue',
                                backgroundColor:'transparent',
                                height: 140,
                                width: 140,
                                alignItems: 'center'
                               }}
                               
                    />
                  </Animated.View>                
                </RotationGestureHandler>
                    </PanGestureHandler>
          </TapGestureHandler>
    );    
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1    
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // width: 80,
    // height: 110,    
    // backgroundColor: 'gray',
    zIndex: -1,
  }
});