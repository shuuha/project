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

  componentDidMount(){
    if(!this.props.isCreated){
      console.log(this.props)
      let { x, y } = this.props;
      x = x - 140 /2;      
      y = y - 140 /2;
      this._translateX.setOffset(x);
      this._translateX.setValue(0);
      this._translateY.setOffset(y);
      this._translateY.setValue(0);
      this._lastOffset.x = x;
      this._lastOffset.y = y;
      // this.props.changeCreated();
    }
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

      // if(another){
      // // this._translateX.setOffset(this._lastOffset.x);
      // this._translateX.setValue(0);
      // // this._translateY.setOffset(this._lastOffset.y);
      // this._translateY.setValue(0);
      // }

      // else 
      if (event.nativeEvent.oldState === State.ACTIVE) {
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
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;      
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };

    _onSingleTap = event => {
      // console.log('inner tap');
    if (event.nativeEvent.state === State.ACTIVE) {
      // this.props.eventId = event.target;      
      // let { x, y } = event.nativeEvent;      
      //   this.setState({ showItem: true})
      //   x = x - this.size.width /2;
      //   y = y - this.size.height /2;
      //   this._translateX.setOffset(x);
      //   this._translateX.setValue(0);
      //   this._translateY.setOffset(y);
      //   this._translateY.setValue(0);
      //   this._lastOffset.x = x;
      //   this._lastOffset.y = y;

      this.props.onBoardSelect(this.props.x);


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
                enabled={ enabled }
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
                        enabled && {zIndex: 300 }, 
                        ]}
                  >
                    <Item
                      refView={ el => this.item = el}                      
                      name={this.props.name}                      
                      style={ 
                              [{ padding: 20,                                 
                                borderRadius: 100, 
                                borderStyle: 'dashed', 
                                borderColor: 'blue',
                                backgroundColor:'transparent',
                                height: 140,
                                width: 140,
                                alignItems: 'center',
                                justifyContent: 'center'
                               }, enabled && {borderWidth: 2 }
                               ]}                               
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
    position: 'absolute',
    // width: 80,
    // height: 110,    
    // backgroundColor: 'gray',
    // zIndex: -1,
  }
});