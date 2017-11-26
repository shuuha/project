import React, { Component } from 'react';
import { NativeRouter as Router, Route, Switch } from 'react-router-native';
import { View } from 'react-native';
import { observer, Provider } from 'mobx-react';

import { serviceStore as store } from '../../stores/'
import { Menu } from '../service';


export class Service extends Component {
    render(){
        return(
            <Provider store={store}>
                <Router>
                    <View
                        style={{flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >                 
                        <Switch>
                            <Route path='/' component={Menu} />
                        </Switch>
                    </View>
                </Router>
            </Provider>
        );
    }
}