import React, { Component } from 'react';
import { Animated, Image, Dimensions, StyleSheet } from 'react-native';

import { loginStore as store } from '../../stores/LoginStore';

import { images } from './assets';

export class Logo extends Component{


    logoAnimation = new Animated.Value(0);    

    componentDidMount(){        
        setTimeout(()=>{
                    Animated.timing(this.logoAnimation, {
                    toValue: -200,
                    duration: 1300
            }).start()
        }, 1500)
    }


    logoTransform = () =>{
        return {
            transform: [ { translateY: this.logoAnimation }]
        }
    }

    render(){
        return(
                <Animated.View
                    style={[styles.logoView, this.logoTransform() ]}
                >
                    <Image
                        style={styles.logo} 
                        source={images['logo']}
                        resizeMode='contain'
                    />
                </Animated.View>
        );
    }
}

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
}

const percentW = (num) => {
    return (width / 100) * num;
}

const styles = StyleSheet.create({
    logoView:{
        position: 'absolute',
        top: '38%',
        alignSelf: 'center'
    },
    logo: {
        height: percentH(22),
        width: percentW(65)        
    },
});