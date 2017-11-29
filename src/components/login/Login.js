import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';

import { 
    Main,
    PassRecovery, 
    SignUp,     
    ActivationCode,
    Register,
    Photos,
    Logo
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

    componentWillMount () {        
        BackHandler.addEventListener('hardwareBackPress', ()=> this.props.store.login.backHandler());
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', ()=> this.props.store.login.backHandler());
    }

    render(){
        const store = this.props.store.login;
        return(
            <Provider store={store} >
                <Router>
                    <View
                        style={{flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >
                        <Logo />
                    
                        <Switch>
                            <Route exact path="/" render={(props)=> {
                                store.history = props.history;
                                return <Main {...props} /> }} />
                            <Route path='/passrecovery' component={PassRecovery} />
                            <Route path='/signup' component={SignUp} />
                            <Route path='/activation' component={ActivationCode} />
                            <Route path='/register' component={Register} />
                            <Route path='/photos' component={Photos} />
                        </Switch>
                    </View>
                </Router>
            </Provider>
        );
    }
}