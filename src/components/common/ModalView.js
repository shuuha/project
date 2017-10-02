import React, { Component } from 'react';
import { Modal, 
  Text, 
  TouchableHighlight, 
  View, 
  Dimensions, 
  StyleSheet,
  Platform
} from 'react-native';

import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export class ModalView extends Component {
  render(){
    return (      
        <Modal
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          animationType="fade"
          transparent={false}
          visible={this.props.store.modalVisible}
          onRequestClose={() => this.props.store.modalVisible = false }
          >

          <View 
            style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
          >
            <Text 
                style={{ 
                    color: 'red', 
                    fontSize: 30, 
                    textAlign: 'center' 
                  }} > 
                  Check your internet connection </Text>  

            <TouchableHighlight
                onPress={()=> this.props.store.hideModal()}
                style={styles.buttonStyle}
            >
              <Text
                style={{ 
                  color: 'rgb(244, 247, 247)',
                  fontSize: 30,
                  

                }}
              > Ok </Text>
            </TouchableHighlight>

          </View>
        </Modal>      
      
    );
  }
}

const styles = StyleSheet.create({ 
  buttonStyle: {
      height: 50, 
      width: Dimensions.get('window').width - 200,
      backgroundColor: 'rgb(66, 134, 244)',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
      ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3
      },
      android: {
          elevation: 3
          }
        })
      }
})