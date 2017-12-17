import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';

import { 
    Main,
    RestorePass, 
    SignUp,     
    SmsConfirm,
    Register,
    Photos,
    Logo,
    PassChange,
    PassChangeDone,
    CameraView
} from '../login';
    
import { observer, inject, Provider } from 'mobx-react';
import { 
    NativeRouter as Router, 
    Route, 
    Redirect, 
    Switch 
} from 'react-router-native';

@inject('store')
@observer
export class Login extends Component{

    componentWillMount() {
        const { levelTwo }= this.props.store.navigation;
        BackHandler.addEventListener('hardwareBackPress', ()=> levelTwo.backHandler());
    }

    componentWillUnmount() {
        const { levelTwo }= this.props.store.navigation;
        BackHandler.removeEventListener('hardwareBackPress', ()=> levelTwo.backHandler());
    }

    render() {
        const store = this.props.store.login;
        const { levelTwo }= this.props.store.navigation;
        return(
            <Provider store={store} >
                <Router>
                    <View
                        style={{flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >
                        <Logo />
                    
                        <Switch>
                            <Route exact path="/" render={(props)=> {
                                levelTwo.history = props.history;
                                return <Main {...props} /> }} />
                            <Route path='/signup' component={SignUp} />
                            <Route path='/smsconfirm' component={SmsConfirm} />
                            <Route path='/register' component={Register} />
                            <Route path='/photos' component={Photos} />
                            <Route path='/restorepass' component={RestorePass} />
                            <Route path='/passchange' component={PassChange} />
                            <Route path='/passchangedone' component={PassChangeDone} />
                            <Route path='/camera' component={CameraView} />
                        </Switch>
                    </View>
                </Router>
            </Provider>
        );
    }
}