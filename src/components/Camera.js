import React, { Component } from 'react';
import { NativeRouter as Router, Route, Switch } from 'react-router-native';
import { observer, Provider } from 'mobx-react';
import { CameraMain, Cam, SinglePicture } from './camera';
import { cameraStore as store } from '../stores/CameraStore';

@observer
export class Camera extends Component{
    render(){
        return(
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path='/' render={(props)=> {
                                            store.history = props.history;
                                            return <CameraMain {...props} /> }} />
                        <Route exact path='/camera' render={(props)=> <Cam/> } />
                        <Route exact path='/camera/:id' render={(props)=> <SinglePicture {...props} /> } />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
