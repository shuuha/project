import React, { Component } from 'react';
import { MapMain } from './map';
import { DrawerMain } from './drawing';
import { NativeRouter as Router, Route, Switch } from 'react-router-native';
import { Provider } from 'mobx-react';
import { mapStore } from '../stores/MapStore';
import { drawingStore } from '../stores/DrawingStore';

export class MapAndDraw extends Component{
    render(){
        return(
            <Provider drawingStore={drawingStore} mapStore={mapStore}>
                <Router>
                    <Switch>
                        <Route exact path='/' render={(props)=> {
                                            mapStore.history = props.history;
                                            return <MapMain {...props} /> }} />
                        <Route exact path='/drawing' render={(props)=> {
                                            drawingStore.history = props.history;
                                            return <DrawerMain {...props}/> }} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}