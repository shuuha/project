import React, { Component } from 'react';
import { View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'

import { observer, inject } from 'mobx-react';

import MapView from 'react-native-maps';

const { height, width } = Dimensions.get('window');

export class MapImage extends Component{

    state = {
        initialRegion :{ 
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        mapSnapshot : " ",
        imgLoaded : false
    }   

    takeSnapshot () {            
    this.map.takeSnapshot({
        // width,      // optional, when omitted the view-width is used
        // height,     // optional, when omitted the view-height is used        
        // format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
        // quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
        // result: 'file'   // result types: 'file', 'base64' (default: 'file')
    })
        .then((uri) => this.setState({ mapSnapshot: uri }))
        .then(() => this.setState({ imgLoaded: true })        
    )}

    render(){
        return (            
            this.state.imgLoaded ?

            <Image 
                style={{ flex: 1 }}
                source={{ uri: this.state.mapSnapshot }} /> 

            :

            <View style={styles.map} >
                <MapView 
                    initialRegion={this.state.initialRegion} 
                    ref={map => { this.map = map }}
                    style={styles.map}
                    >
                    
                    {/*<MapView.Marker coordinate={this.state.coordinate} />*/}
                </MapView>
                <TouchableOpacity onPress={this.takeSnapshot.bind(this)}>
                    <Text>
                        Take Snapshot
                    </Text>
                </TouchableOpacity>
            </View>            
        );
    } 
}

const styles = StyleSheet.create({  
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

 
