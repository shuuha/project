import React, { Component } from 'react';
import { 
    View, 
    Image,
    Animated,
    TouchableWithoutFeedback,
    Dimensions
    } from 'react-native'; 

import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { USE_NATIVE_DRIVER } from './config';

const BUTTON_PRESS_DELAY = 500;
const { height, width } = Dimensions.get('window');

export class  Item extends Component{   
    constructor(props){
        super(props);

    

    this.ITEM_HEIGHT = width / 3.5;
    this.ITEM_WIDTH = width / 3.5;

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

        const { imageScale: scale } = this.props.store;    
        const valueX = this.pan.x._value / scale;
        const valueY = this.pan.y._value / scale;
        this.pan.x.setValue(valueX);
        this.pan.y.setValue(valueY);
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
        }
        else {
            const { x, y } = this.props.store;
            this.pan.x.setOffset(this.pan.x._value);
            const deployX = this.pan.x._value + x;
            this.pan.x.setValue(0);
            this.pan.y.setOffset(this.pan.y._value);
            const deployY = this.pan.y._value + y;
            this.pan.y.setValue(0);            
            this.props.store.addNewItemOnBoard(this.props.name, deployX, deployY);
        }        
        this.props.store.setOverlayInitialState();
        this.props.store.hideOverlay();
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
        const { imageScale : scale } = this.props.store;
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
                    ref={ el => this.item = el }
                    style={[{
                            backgroundColor: 'transparent',
                            height: this.ITEM_HEIGHT / scale,
                            width: this.ITEM_WIDTH / scale,
                            justifyContent: 'center',
                            alignItems: 'center',                            
                            borderStyle: 'dashed',
                            borderRadius: 100,
                            borderColor: 'blue',
                            padding: 2 * scale,
                            margin: 2 * scale,
                        }, this.animatedTransform(), 
                        this.props.isSelected && { borderWidth: this.backStyle
                            },
                        style]}
                    >
                    <TouchableWithoutFeedback                        
                        onLongPress={this.handleLongPress}
                        delayLongPress={BUTTON_PRESS_DELAY}
                    >                    
                        <Image
                            source={images[name]}
                            style={{
                                    height: (this.ITEM_HEIGHT - 20) / scale,
                                    width: (this.ITEM_WIDTH - 20) / scale
                            }}
                            resizeMode='contain'
                        />                    
                    </TouchableWithoutFeedback>
                </Animated.View>                
            </PanGestureHandler>        
        );
    }
}