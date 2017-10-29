import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native'
import { observer, inject } from 'mobx-react';

import MapView from 'react-native-maps';
import { Button } from './Button';

// import { mapStore as store } from '../stores/MapStore';

const { height: windowHeight } = Dimensions.get('window');

@inject('mapStore')
@observer
export class MapMain extends Component{
    componentDidMount() {
        this.props.mapStore.getCurrentLocation();
        this.props.mapStore.watchPosition();
    }

    componentWillUnmount() {
        this.props.mapStore.clearWatch();
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
       const { mapStore : store } = this.props;
        return (
                <View style={styles.container}>
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