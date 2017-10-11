import React, { Component } from 'react';
import { 
    Alert,
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Dimensions,
    Platform
} from 'react-native'
import { observer, inject } from 'mobx-react';
import MapView from 'react-native-maps';
import { getRegionForCoordinates } from './getCoordinates';
import {drawStore } from './drawStore';

const { height, width } = Dimensions.get('window');

@observer
export class MapImage extends Component{

    state = {
        region :{},
        regionLoaded: false,
        statusBarHeight: 1,
        mapSnapshot : " ",
        imgLoaded : false
    }

    componentDidMount() {
     navigator.geolocation.getCurrentPosition(
       ({coords}) => {
         const {latitude, longitude} = coords
         this.setState({
           position: {
             latitude,
             longitude,
           },
           region: {
             latitude,
             longitude,
             latitudeDelta: 0.005,
             longitudeDelta: 0.001,
           },
           regionLoaded: true
         })
       },
       (error) => alert('Error: Are location services on?'),
       {timeout: 10000 }
     );
     this.watchID = navigator.geolocation.watchPosition(
       ({coords}) => {
         const {latitude, longitude} = coords
         this.setState({
           position: {
             latitude,
             longitude
           }
         })
     });
   }
   componentWillUnmount() {
     navigator.geolocation.clearWatch(this.watchID);
   }

    _findMe = () =>{
   navigator.geolocation.getCurrentPosition(
     ({coords}) => {
       const {latitude, longitude} = coords
       this.setState({
         position: {
           latitude,
           longitude,
         },
         region: {
           latitude,
           longitude,
           latitudeDelta: 0.005,
           longitudeDelta: 0.001,
         }
       })
     },
     (error) => alert(JSON.stringify(error)),
     {timeout: 10000}
   )
 }

    // takeSnapshot = () => {            
    // this.map.takeSnapshot({
    //     // width,      // optional, when omitted the view-width is used
    //     // height,     // optional, when omitted the view-height is used        
    //     // format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
    //     // quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
    //     // result: 'file'   // result types: 'file', 'base64' (default: 'file')
    // })
    //     .then((uri) => drawStore.mapUri = uri)
    //     .then(() => drawStore.imgLoaded = true)
    // }    

    render(){
        const { mapType } = drawStore;
        console.log( mapType );

        const { height: windowHeight } = Dimensions.get('window');
        const varTop = windowHeight - 125;        
        const hitSlop = {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
        }
        bbStyle = function(vheight) {
            return {
                position: 'absolute',
                top: vheight,
                left: 10,
                right: 10,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-around',
            }
        }

        const { buttonTextStyle } = styles;

        return (                
                this.state.regionLoaded &&

                <View style={styles.container}>
                    <View style={bbStyle(varTop)}>
                        <TouchableOpacity
                            hitSlop = {hitSlop}
                            activeOpacity={0.7}
                            style={styles.mapButton}
                            onPress={this._findMe}
                        >
                            <Text style={buttonTextStyle}>
                                My  location
                            </Text>
                            <Text style={buttonTextStyle}>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop = {hitSlop}
                            activeOpacity={0.7}
                            style={styles.mapButton}
                            onPress={ ()=> {
                                if(mapType === 'satellite')
                                    drawStore.changeMapType('standard');
                                else 
                                    drawStore.changeMapType('satellite');
                                    }}
                        >
                            <Text style={buttonTextStyle}>
                                { mapType === 'satellite' && 'Standart map' }
                                { mapType === 'standard' && ' Hybrid map ' }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop = {hitSlop}
                            activeOpacity={0.7}
                            style={styles.mapButton}
                            onPress={ ()=> drawStore.takeSnapshot(this.map) }
                        >
                            <Text style={buttonTextStyle}>
                                Edit mode
                            </Text>                            
                        </TouchableOpacity>
                    </View>
                    <MapView
                        ref={(el)=> this.map = el}
                        style={styles.map}
                        region={this.state.region}
                        showsUserLocation={true}
                        mapType={mapType}
                    >
                    </MapView>
                </View>
        );
{/*                    this.state.imgLoaded ?

            <Image 
                style={{ flex: 1 }}
                source={{ uri: this.state.mapSnapshot }} /> 

            :*/}
    } 
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#EEEEEE',
 },
 text: {
   color: 'white',
 },
   map: {
   flex: 1,
   zIndex: -1, 
 },
 mapButton: {
   width: 75,
   height: 75,
   borderRadius: 85/2,
   backgroundColor: 'rgba(252, 253, 253, 0.9)',
   justifyContent: 'center',
   alignItems: 'center',
    ...Platform.select({
    ios: {
        shadowColor: 'black',
        shadowRadius: 8,
        shadowOpacity: 0.12,
    },
    android: {
        elevation: 3
        }
   }),
   opacity: .6,
   zIndex: 10,
   },
   buttonTextStyle: {
       fontWeight: 'bold', 
       color: 'black',
       textAlign: 'center'
   }   
})