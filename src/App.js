import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { NativeRouter as Router, Route, Switch } from 'react-router-native';
import { observer, Provider } from 'mobx-react/native';

import Drawer from './components/Drawer';
import { DrawItem } from './components/common';
import ItemList  from './components/common/drawOnMap/ItemList';
import { MapImage } from './components/common';
import { drawStore } from './components/common/drawOnMap';

import Page from './components/Page';
import { AppStore } from './stores/AppStore';

const store = new AppStore();

@observer
export default class App extends Component{

    render(){
        // const { pages, dataLoaded } = store;
        return(    
             <Router>
                <Switch>
                    <Route exact path='/' render={(props)=> {
                                        drawStore.history = props.history;
                                        return <MapImage {...props} /> }} />
                    <Route exact path='/1' render={(props)=> {
                                        // drawStore.history = props.history;
                                        return <Drawer {...props}/> }} />
                </Switch>
            </Router>
        );
    

            {/*dataLoaded ? 
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
            </View>*/}
        // );
    }
}
