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

    this.state = {
        iconSize: {},
        diffX: 0,
        diffY: 0
    }   

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
      outputRange: [1, 1],
        })
    }

    componentWillUnmout(){
        this.handleDrag.removeAllListeners();
    }

    handleDrag = () => {        
        if(!this.props.dragActive){                     // disabling dragging
            this.pan.x.setValue(0);
            this.pan.y.setValue(0);
        }

        const { imageScale: scale } = this.props.store;    // scaling the translation values to move plain on any zoomed view
        const valueX = this.pan.x._value / scale;       // calculating the scaled values
        const valueY = this.pan.y._value / scale;
        this.pan.x.setValue(valueX);                    // applying the scaled values to be dragged correctly according to the zoom
        this.pan.y.setValue(valueY);
    }


    getIconSize = e => {
        this.setState({ iconSize : e.nativeEvent.layout});
    }

    handleLongPress = (e) => {      // calculating the distance needed to substract to get accurate deployment
        const { locationX, locationY } = e.nativeEvent;             // getting touch coords of the element
        const iconHalfHeight = this.state.iconSize.height / 2;     
        const iconHalfWidth = this.state.iconSize.width / 2;
        this.setState({ 
            diffY: locationY - iconHalfHeight,              // the difference in offset values
            diffX: locationX - iconHalfWidth                
            })        
        this.props.store.selectOne(this.props.id);
    }

    _onDragHandlerStateChange = event => {
        this.props.store.showDeleteButton();                // while drag is active, show recycle bin icon
    if (event.nativeEvent.oldState === State.ACTIVE && this.props.dragActive) {    // on release of the drag gesture
            const { absoluteX : x, absoluteY : y } = event.nativeEvent;         // get the coords by the screen coords, no matter the zoom, coords are taken according to the current view
            const { pageX : dropX,  pageY  : dropY} = this.props.store.deleteIconPos;
        if( dropX < x && dropY < y){                        // if and element is inside the zone
            this.props.store.hideAll();                 
        }
        else {
            const { x, y } = this.props.store;              // taking the coords saved by the Tap handler in the Img component (to get the current location of the element in the image)
            const deployX = this.pan.x._value + x - this.state.diffX;  // calculating the coords of the deployment 
            const deployY = this.pan.y._value + y - this.state.diffY;  // coords are made of: 1) value that the element have passed since the Tap, 2) the Img's Tap coords; 3) see  this.state.diffY

            this.pan.x.setOffset(this.pan.x._value);            // saving the position of the dragged element
            this.pan.x.setValue(0);                             // reseting the values
            this.pan.y.setOffset(this.pan.y._value);
            this.pan.y.setValue(0);

            this.props.store.addNewItemOnBoard(this.props.name, deployX, deployY); // adding new item on board
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
                        onLayout={this.getIconSize}
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