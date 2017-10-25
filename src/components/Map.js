import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native'
import { observer, inject } from 'mobx-react';

import MapView from 'react-native-maps';
import { Button } from './map';
import { Spinner } from './common';

import { mapStore as store } from '../stores/MapStore';

const { height: windowHeight } = Dimensions.get('window');

@observer
export class Map extends Component{

    state = {
        modalVisible: true
    }

    componentDidMount() {
        store.getCurrentLocation();
        store.watchPosition();
    }

    componentWillUnmount() {
        store.clearWatch();
    }

    bbStyle(){        
            return {
                position: 'absolute',
                top: windowHeight - 125,
                left: 10,
                right: 10,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-around',
        }
   }   

   render(){       
        return (
            

                <View style={styles.container}>
                    { 
                    store.isImageLoading ?                        
                    <View style={{ backgroundColor: 'transparent' }} >
                        <Spinner />
                    </View>
                    :
                    <View style={this.bbStyle()}>                        
                        <Button 
                            label=' My  location '
                            onPress={store.getCurrentLocation}
                        />                        
                        <Button 
                            label={store.buttonLabel}
                            onPress={store.switchMapType}
                        />
                        <Button 
                            label='Make a snapshot'
                            onPress={()=>store.takeSnapshot(this.map)}
                        />
                    </View>
                    }
                    <MapView
                        ref={(el)=> this.map = el}
                        style={styles.map}
                        region={store.region}
                        showsUserLocation={true}
                        mapType={store.selectedMapType}
                        onRegionChangeComplete={store.regionChangeComplete}
                    >                    
                    </MapView>
                </View>                
        );
    } 
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#EEEEEE',
 }, 
   map: {
    flex: 1,
    zIndex: -1, 
 } 
});