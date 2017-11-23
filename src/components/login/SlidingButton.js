import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions, 
    StyleSheet, 
    PanResponder,
} from 'react-native';

const DISTANCE_TO_TRIGGER = -150;


export class SlidingButton extends Component {
    constructor(props){
        super(props);

        this.animatedValue = new Animated.ValueXY();
        this.value = { x: 0, y: 0 };

        this.panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (e, gesturState) => {                
                    this.animatedValue.setOffset({ x: this.value.x, y: this.value.y });
                    this.animatedValue.setValue({ x: 0, y: 0 });                
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.animatedValue.x, dy: this.animatedValue.y }
            ],
            { listener: this.panHandler }),
            onPanResponderRelease: () => {
                const value = this.animatedValue.x._value;
                if(value < DISTANCE_TO_TRIGGER){
                    this.handleSliderButtonRelease();
                }
                else {
                    this.animatedValue.setOffset({ x: 0 });
                    this.animatedValue.setValue({ x: 0 })    
                }

                this.animatedValue.setOffset({ x: 0, y: 0 });
                this.animatedValue.setValue({ x: 0, y: 0 })
            }
        });        

        this.interpolatedColorAnimation = this.animatedValue.x.interpolate({            
            inputRange: [-300, 0],
            outputRange: ['rgba(10, 94, 0, 1)', 'rgba(95, 189, 103, 1)'],
            extrapolate: 'clamp'
        });

    }

    componentWillUnmout(){
        this.animatedValue.removeAllListerners;
    }
    
    panHandler = () => {
        if(this.animatedValue.x._value > 0){
            this.animatedValue.setValue({x: 0});
            this.animatedValue.x._value = 0;
        }
    }

    handleSliderButtonRelease = () => {
        this.props.onSlideSuccess && this.props.onSlideSuccess();
    }

    transformStyles = () => {
        return {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            transform: [
                {translateX: this.animatedValue.x}],
            
        }
    }

    render(){
        return(
            <Animated.View
                pointerEvents = 'box-none'
                style={[styles.container, 
                    { backgroundColor: this.interpolatedColorAnimation}
                    ]}            
            >
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={this.transformStyles()}
                >
                    <Text style={styles.text} >{this.props.price}</Text>
                    <View
                        style={styles.textContainer}
                    >
                        <Text style={styles.text} >Slide to accept</Text>
                    </View>
                </Animated.View>
            </Animated.View>
        );
    }
}

const { width, height } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
};

const percentW = (num) => {
    return (width / 100) * num;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(95, 189, 103)',
        width,
        height: percentH(10),
        marginTop: percentH(4),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textContainer: {
        borderLeftWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid',
        paddingLeft: percentW(12)
    },
    text: {
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontStyle: 'italic',
        fontSize: 25
    },
})