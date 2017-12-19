import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform
    } from 'react-native';
import { inject, observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-camera';

@inject('store')
@observer
export class CameraView extends Component {
    render() {
        const { 
            register: { photos: store }
        } = this.props.store;

        return (
        <View style={styles.container}>
            <Camera
                ref={(cam) => {
                    this.camera = cam; 
                }}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
                captureTarget={Camera.constants.CaptureTarget.disk}                
                captureQuality="high"
                type={store.type}
            >
                <TouchableWithoutFeedback
                    onPress={ () => store.switchCamera(this.camera)} 
                    // style={styles.cameraSwitch}
                >
                    <Icon 
                        name='camera-switch'
                        size={ 65 }
                        style={ [{ color: 'rgb(188, 184, 184)'}, styles.cameraSwitch] }
                    />                    
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={ () => store.useCamera(this.camera)} 
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
  },
  cameraSwitch: {
    position: 'absolute',
    ...Platform.select({
        ios: {
            top: '3%'
            },
        android: {
            top: '1%',
        }
      }),
    right: '5%'
  }
});