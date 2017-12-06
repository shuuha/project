import React, { Component } from 'react';
import { NativeRouter as Router, Route, Switch } from 'react-router-native';
import { View, BackHandler } from 'react-native';
import { observer, inject, Provider } from 'mobx-react';

import { Menu, LoggedIn, Logo } from '../service';

@inject('store')
@observer
export class Service extends Component {

    componentWillMount () {
        const { levelTwo }= this.props.store.navigation;
        BackHandler.addEventListener('hardwareBackPress', ()=> levelTwo.backHandler());
    }

    componentWillUnmount () {
        const { levelTwo }= this.props.store.navigation;
        BackHandler.removeEventListener('hardwareBackPress', ()=> levelTwo.backHandler());
    }

    render(){
        const store = this.props.store.service;
        const { levelTwo }= this.props.store.navigation;
        return(
            <Provider store={store}>
                <Router>
                    <View
                        style={{flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >        
                        <Logo />

                        <Switch>
                            <Route exact path='/' render={(props)=> {
                                levelTwo.history = props.history;
                                return <LoggedIn /> }} />
                            }}
                            <Route path='/menu' component={Menu} />
                        </Switch>
                    </View>
                </Router>
            </Provider>
        );
    }
}