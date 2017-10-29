import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Platform, 
    StyleSheet,
    TouchableWithoutFeedback,
    BackHandler
    } from 'react-native';
import { inject } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-camera';

@inject('store')
export class Cam extends Component{
    componentWillMount(){        
        BackHandler.addEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', 
            ()=> this.props.store.backHandler());
    }

    render() {
        return (
        <View style={styles.container}>
            <Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
                captureTarget={Camera.constants.CaptureTarget.disk}
                captureQuality="medium"
            >
                <TouchableWithoutFeedback
                    onPress={()=> this.props.store.takePicture(this.camera)}
                    style={{ marginBottom: 40 }}
                >
                    <Icon 
                        name='camera'
                        size={ 85 }
                        style={{ color: 'rgb(188, 184, 184)', marginBottom: 20 }}
                    />                    
                </TouchableWithoutFeedback>               
            </Camera>
        </View>
        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});