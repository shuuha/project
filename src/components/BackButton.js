import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions, 
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';

import { withRouter } from 'react-router-native';

import { observer, inject } from 'mobx-react';
import { images } from './assets';

@inject('store')
@observer
class BackButton extends Component{
    render(){        
    const { pathname } = this.props.history.location;
        return(            
             (pathname !== '/'
             && this.props.store.showBackButton) &&
            <TouchableOpacity
                style={styles.button}
                onPress={()=> this.props.store.handleBackNavigation()}
            >
                <Image
                    source={images['arrow']}
                    resizeMode='contain'
                    style={styles.buttonImage}
                />
            </TouchableOpacity>            
        );
    }
}

BackButton = withRouter(BackButton);
export { BackButton };

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
};

const percentW = (num) => {
    return (width / 100) * num;
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 2,
        ...Platform.select({
            ios: {
                top: percentH(4)
            },
            android: {
                top: percentH(3)
            }
        }),
        left: percentW(4)
    },
    buttonImage: {
        height: percentH(5),
        width: percentH(5)
    }
})