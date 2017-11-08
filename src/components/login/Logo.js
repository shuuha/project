import React, { Component } from 'react';
import { 
    Animated, 
    Image, 
    Dimensions, 
    StyleSheet, 
    View
    } from 'react-native';
import { observer, inject } from 'mobx-react';

import { loginStore as store } from '../../stores/LoginStore';

import { images } from './assets';

@inject('store')
@observer
export class Logo extends Component{

    logoAnimation = new Animated.Value(200);    

    componentDidMount(){
        if(this.props.store.showLogoAnimation){
            setTimeout(()=>{
                        Animated.timing(this.logoAnimation, {
                        toValue: 0,
                        duration: 1300
                }).start(()=> this.props.store.showLogoAnimation = false)
            }, 1500)
        }
    }


    logoTransform = () =>{
        return {
            transform: [ { translateY: this.logoAnimation }]
        }
    }

    render(){
        return(

                <Animated.View
                    style={[styles.logoView, this.props.store.showLogoAnimation && this.logoTransform()  ]}
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
        // position: 'absolute',
        // top: '38%',
        // left: '11%'
        marginTop: percentH(7),
        marginLeft: percentW(11)        
    },
    logo: {
        height: percentH(22),
        width: percentW(71)
    },
});