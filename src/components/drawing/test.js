import React, { Component } from 'react';
import { 
    View, 
    Image,
    Animated,
    TouchableWithoutFeedback
    } from 'react-native'; 

import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { USE_NATIVE_DRIVER } from './config';

const BUTTON_PRESS_DELAY = 500;

export class  Item extends Component{   
    constructor(props){
        super(props);

    this.pan = new Animated.ValueXY();
    this.lastOffset = { x: 0, y: 0}

    /*draggable*/
    this._onDragGestureEvent = Animated.event(
        [{  nativeEvent: {
                translationX: this.pan.x,
                translationY: this.pan.y }}],      
        { useNativeDriver: USE_NATIVE_DRIVER,
            listener: this.handleDrag });

    //background style
    this._backgroundStyle = new Animated.Value(0);
    this.backStyle = this._backgroundStyle.interpolate({
      inputRange: [0, 100],
      outputRange: [2, 2],
        })
    }

    componentWillUnmout(){
        this.handleDrag.removeAllListeners();
    }

    handleDrag = () => {        
        if(!this.props.dragActive){
            this.pan.x.setValue(0);
            this.pan.y.setValue(0);
        }            
    }

    handleLongPress = (e) => {        
        this.props.store.selectOne(this.props.id);
    }

    _onDragHandlerStateChange = event => {
        this.props.store.showDeleteButton();
    if (event.nativeEvent.oldState === State.ACTIVE && this.props.dragActive) {
            const { absoluteX : x, absoluteY : y } = event.nativeEvent;
            const { pageX : dropX,  pageY  : dropY} = this.props.store.deleteIconPos;
        if( dropX < x && dropY < y){
            this.props.store.hideAll();
            this.props.store.setOverlayInitialState();
            this.props.store.hideOverlay();
        }
        else {
            this.pan.x.setOffset(this.pan.x._value);
            this.pan.x.setValue(0);
            this.pan.y.setOffset(this.pan.y._value);
            this.pan.y.setValue(0);
            console.log(event.nativeEvent);
            this.item._component.measure((x, y, w, h, px, py)=> {
                console.log('item', w, h, px, py);
            this.props.store.addNewItemOnBoard(this.props.name, px, py);
            this.props.store.setOverlayInitialState();
            this.props.store.hideOverlay();
            })
        }
        this.props.store.hideDeleteButtonWithDelay();
    }
  };
  
  animatedTransform(){      
    const temp =  { transform: [{ translateX: this.pan.x },
                                { translateY: this.pan.y },                             
                                ]};
    return temp;
  } 


    render(){
     const {
         onPress,  
         name, 
         isSelected, 
         style, 
         refView, 
         images,
         onPressIn,
         imageStyle
         } = this.props;

     

        return(
            <PanGestureHandler
                onGestureEvent={this._onDragGestureEvent}
                onHandlerStateChange={this._onDragHandlerStateChange}
            >
                <Animated.View
                    pointerEvents = 'box-none'
                    ref={ el => this.item = el }
                    style={[{ backgroundColor: 'rgb(255, 255, 255)'}, this.animatedTransform(), 
                        this.props.isSelected && { borderWidth: this.backStyle
                            },
                        style]}
                    >
                    <TouchableWithoutFeedback                        
                        onLongPress={this.handleLongPress}
                        delayLongPress={BUTTON_PRESS_DELAY}                        
                    >
                        <Image
                            // ref={el => this.item = el }
                            style={[/*{ margin: 10 },*/ imageStyle]}
                            source={images[name]}
                            // resizeMode='center'
                        />
                    </TouchableWithoutFeedback>
                </Animated.View>
            </PanGestureHandler>
        );
    }
}