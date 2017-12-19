import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    CameraRoll,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import { observer, inject } from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

@inject('store')
@observer
export class Photos extends Component{   

    componentWillMount(){
        this.props.store.register.photos.getInitialPhotos();
    }

    
    renderRow = (data) => {        
        const uri = data.node.image.uri;
        const { photos : store } = this.props.store.register;
        
        return(
            <TouchableOpacity
                onPress={() => store.selectImage(uri)}
                style={[styles.row, { 
                    borderColor: 'white', 
                    borderWidth: 1,
                    borderStyle: 'solid',  }]}
            >
                <Image 
                    style={{ flex: 1 }}
                    source={{ uri }}
                />
            </TouchableOpacity>
        );
    }

    render(){
        const { photos : store } = this.props.store.register;

        return(
            <View style = {{ flex: 1 }} >
                <ListView
                    style={styles.container}
                    contentContainerStyle={styles.grid}                    
                    dataSource={store.dataSource}
                    renderRow={this.renderRow}
                    enableEmptySections
                    pageSize={15}
                    onEndReached={store.endReached}                    
                >
                </ListView>
                <View
                    style={styles.header}
                >
                    <Text
                        style={styles.headerText}
                    >Photos</Text>

                    <TouchableWithoutFeedback 
                        onPress={store.onCameraIconPress}
                    >
                        <Icon 
                            name={'camera'}
                            size={percentH(7)}
                            style={styles.cameraIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
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
        marginTop: percentH(12)
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    row : {
        height: width / 4,
        width: width / 4
    },
    header: {
        position: 'absolute',
        top: percentH(1),
        left: percentW(37),
        width: percentW(63),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: percentW(8),
        fontWeight: '500',
        fontFamily: 'Arial',
        color: 'rgb(255, 255, 255)'
    },
    cameraIcon: {
        marginTop: percentH(1),
        marginRight: percentW(3),
        color: 'rgb(255, 255, 255)'
    }
})