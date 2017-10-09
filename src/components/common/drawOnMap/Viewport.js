import React, { Component } from 'react';
import {    
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Easing,
    Dimensions,
    Transform
} from 'react-native';


export default class Viewport extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            currentPanValue : {x: 0, y: 0},
            showDraggable   : true,            
            dropZoneValues  : null,
            pan             : new Animated.ValueXY()
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder    : () => true,
            onPanResponderMove              : Animated.event([null,{
                dx  : this.state.pan.x,
                dy  : this.state.pan.y
            }]),
            onPanResponderRelease           : (e, gesture) => {                
                if(this.isDropZone(gesture)){
                    this.setState({
                        showDraggable : false
                    });
                }
                else {
                this.state.currentPanValue.x += this.state.pan.x._value;
                this.state.currentPanValue.y += this.state.pan.y._value;

                this.state.pan.setOffset({x: this.state.currentPanValue.x, y: this.state.currentPanValue.y});
                this.state.pan.setValue({x: 0, y: 0});
            }}
        });
    }


  componentWillMount() {
    this._animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animatedValue, {
        toValue: 100,
        duration: 3000
    }).start(); 
  }


    isDropZone(gesture){
        var dz = this.state.dropZoneValues;        
        return gesture.moveY > dz.y && gesture.moveX < dz.x + dz.height;
    }

    setDropZoneValues(event){
        this.setState({
            dropZoneValues : event.nativeEvent.layout
        });
    }

    render(){




        return (
            <View style={styles.mainContainer}>
                
                    <View 
                        onLayout={this.setDropZoneValues.bind(this)}
                        style={styles.dropZone}>                        
                        <Text style={styles.text}                        
                        >Drop me here!</Text>                        
                    </View>
                

                {this.renderDraggable()}                

            </View>
        );
    }

    renderDraggable(){

        const interpolatedRotateAnimation = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0deg', '360deg']
        });


        if(this.state.showDraggable){
            return (
                <View style={styles.draggableContainer}>
                    <Animated.View 
                        {...this.panResponder.panHandlers}
                        style={[
                            this.state.pan.getLayout(), 
                            styles.square, 
                            {transform: [{rotate: interpolatedRotateAnimation}]}
                            ]}
                            >
                        <Text style={styles.text}>Drag me!</Text>
                    </Animated.View>
                </View>
            );
        }
    }
}


let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    dropZone    : {
        position: 'absolute',
        // top: 100,
        // left: 100,
        right: 0,
        bottom: 0,
        height  : 80,
        width   : 80,
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        top         : 0,
        left        : 0,
    },
    square      : {
        backgroundColor     : '#1abc9c',
        width               : 100,
        height              : 100        
    },
    // spin: {
    //     transform: [{ rotate: '90deg'}]
    // }
});