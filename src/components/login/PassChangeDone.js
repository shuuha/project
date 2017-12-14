import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated,
    Dimensions,
    TouchableOpacity,
    Image,
    PixelRatio,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class PassChangeDone extends Component {

    animatedValue = new Animated.Value(0);

    componentDidMount() {
        setTimeout( () => {
            Animated.timing(this.animatedValue, {
                toValue: 1,
                duration: 200
            }).start();
        }, 200)        
    }   
    
    render() {
        const { 
            passChange : store, 
            appStore: { loading} } 
            = this.props.store;
        return (
            <Animated.View
                style={[
                    styles.container, 
                    { opacity: this.animatedValue }
                ]}
            >
                <View
                    style={{ paddingTop: percentH(5) }}
                >
                    <Text
                        style={{
                            fontSize: percentW(6),
                            color: 'rgb(255, 255, 255)',
                            textAlign: 'center',
                            paddingBottom: percentH(5)
                        }}
                    > Password successfully changed </Text>
                    <Icon 
                        name={'check'}
                        size={percentH(10)}
                        style={{ 
                            color: 'rgb(255, 255, 255)', 
                            alignSelf: 'center',
                            paddingBottom: percentH(5)
                        }}
                    />
                </View>

                    <View style={styles.submitButton} >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={store.onGoToLogin}
                            disabled={loading}
                        >
                            <Text
                                style={{ 
                                    color: 'rgb(255, 255, 255)', 
                                    fontSize: percentW(5), 
                                }}
                            >Go to login page</Text>
                        </TouchableOpacity>                        
                    </View>
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
        height,
        width: percentW(74),
        alignSelf: 'center',
        paddingHorizontal: percentW(5)
    },
    submitButton: {
        height: percentH(5.5),
        width: percentW(64),
        marginTop: percentH(1.5),
        borderRadius: 5,
        backgroundColor: 'rgb(95, 188, 102)'
    }
});