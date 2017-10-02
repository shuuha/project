import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { NativeRouter as Router, Route } from 'react-router-native';
import { observer, Provider } from 'mobx-react/native';

import DragAndDrop from './components/DragAndDrop';

import Page from './components/Page';
import { AppStore } from './stores/AppStore';

const store = new AppStore();

@observer
export default class App extends Component{

    render(){        
        const { pages, dataLoaded } = store;
        return(
            dataLoaded ? 
                <Provider store={store} >
                    <Router>
                        <View>
                            { pages.map(q => 
                            <Route exact path={q.page} key={q.page} render={(props)=>{ 
                                store.history=props.history;                               
                                return <Page {...props} page={q}  /> }                        
                                }  />)}
                        </View>
                        </Router>
                </Provider> :

            <View style={{ height: Dimensions.get('window').height, flex: 1,  justifyContent: 'center', alignItems: 'center'  }}>
                <Text style={{ fontSize: 25, }}> Loading data... </Text>
            </View>
        );
    }
}