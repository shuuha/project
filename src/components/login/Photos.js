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
    TouchableOpacity
} from 'react-native';

import { observer, inject } from 'mobx-react';

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
                onPress={()=>store.selectImage(uri)}
                style={[styles.row, { 
                    borderColor: 'white', 
                    borderWidth: 1,
                    borderStyle: 'solid',  }]}
            >
                <Image 
                    style={{flex: 1}}
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
                </View>
            </View>
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
    container: {
        flex: 1,
        marginTop: percentH(10)
        // flexDirection: 'row'
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
        top: percentH(5),
        left: percentW(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Arial',
        color: 'rgb(255, 255, 255)'
    }
})