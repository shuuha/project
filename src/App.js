import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NativeRouter as Router, Route } from 'react-router-native';
import { observer, Provider } from 'mobx-react/native';

import Page from './components/Page';
import { AppStore } from './stores/AppStore';

const store = new AppStore();

export default class App extends Component{

    render(){        
        const { pages } = store;
        return(
                <Provider store={store} >
                    <Router>
                            <View>
                       { pages.map(q => <Route exact path={q.page}  key={q.page} 
                                                render={(props)=> <Page {...props} page={q} key={q.page} /> }  /> )}
                        
                        </View>
                    </Router>
                </Provider>
        );
    }
}