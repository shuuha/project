import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    PixelRatio,
    Dimensions,
    TouchableOpacity,
    Platform,
    Animated
} from 'react-native';

import { observer, inject } from 'mobx-react';
import { SlidingButton, Map } from '../service';

import { images } from './assets';

@inject('store')
@observer
export class Menu extends Component {

    animatedView = new Animated.Value(0);

    componentDidMount = () => {
        setTimeout(()=>{
            Animated.timing(this.animatedView, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)
    }

    renderIconAndText = (icon, text, style) => {
        return (
                <View
                    style={[styles.iconAndText, style]}
                >
                    <Image 
                        source={images[icon]}
                        style={styles.icon}
                        resizeMode='contain'
                    />
                    <Text
                        style={styles.text}
                    > { text } </Text>
                </View>
        );
    }

    renderButton = (name, onPress) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.button}
            >
            <Text
                style={styles.buttonText}
            >{ name } </Text>
            </TouchableOpacity>
        );
    }    

    render(){
        const { 
            companyName, 
            companyAddress, 
            currentTime, 
            timeToComplete,
            seconds,
            balance,
            onPhotoshopPress,
            onHtmlPress,
            onWebDesignPress,
            onSlideSuccess
        } = this.props.store.menu;
        return(
            <Animated.View
                style={[styles.container,  { opacity: this.animatedView } ]}
            >
                <Text
                    style={styles.companyName}
                > { companyName } </Text>         
                <Text
                    style={styles.companyAddress}
                > { companyAddress } </Text>

                <View
                    style={styles.mapContainer}
                >
                    {/*<Map />*/}
                </View>

                <View
                    style={styles.iconsAndButtonsContainer}
                >
                    <View
                        style={styles.iconAndTextContainer}
                    >            
                        { this.renderIconAndText('clock1', currentTime) }
                        { this.renderIconAndText('money', balance) }
                        { this.renderIconAndText('clock', timeToComplete, { borderBottomWidth: 0}) }
                    </View>

                    <View
                        style={styles.buttonsContainer}
                    >
                        { this.renderButton('Photoshop', onPhotoshopPress)}
                        { this.renderButton('Web Design', onWebDesignPress)}
                        { this.renderButton('HTML', onHtmlPress)}
                    </View>
                </View>

                    <SlidingButton 
                        onSlideSuccess={onSlideSuccess}
                        seconds={seconds}
                    />
            </Animated.View>
        );
    }
}

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
};

const percentW = (num) => {
    return (width / 100) * num;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    companyName: {
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(8),
        alignSelf: 'center',        
        marginBottom: percentH(4),
        ...Platform.select({
            ios: {
                marginTop: percentH(12)
            },
            android: {
                marginTop: percentH(7)
            }
        })
    },
    companyAddress: {
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontStyle: 'italic',
        fontSize: percentW(6),
        alignSelf: 'center',
        marginBottom: percentH(2)
    },
    mapContainer: {
        width,
        height: percentH(30),
        backgroundColor: 'gray'
    },
    iconsAndButtonsContainer: {
        marginTop: percentH(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconAndTextContainer: {
        marginLeft: percentW(7),        
        width: percentW(43),
        justifyContent: 'center'
        
    }, 
    iconAndText: {
        flexDirection: 'row',
        // width: percentW(50),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    text: {
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(7),
        marginVertical: percentH(1)
    },
    icon: {
        ...Platform.select({
            ios: {
                height: PixelRatio.getPixelSizeForLayoutSize(12),
                width: PixelRatio.getPixelSizeForLayoutSize(12),
            },
            android: {
                height: PixelRatio.getPixelSizeForLayoutSize(10),
                width: PixelRatio.getPixelSizeForLayoutSize(10)
            }
        })
    },
    buttonsContainer: {        
        marginRight: percentW(7),
        paddingLeft: percentW(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: 'rgb(89, 113, 144)',
        borderStyle: 'solid'
    },
    button: {
        height: percentH(5),
        width: percentH(16),
        marginVertical: percentH(1),
        borderRadius: 5,
        backgroundColor: 'rgb(95, 189, 103)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'rgb(255, 255, 255)', 
        fontFamily: 'Arial', 
        fontSize: percentW(4)
    }
})