import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';

import { 
    LoginView, 
    Logo, 
    PassRecovery, 
    SignUp, 
    BackButton,
    ActivationCode,
    Register,
    Photos,
    LoggedIn,
    ErrorText,
    FBInfo
    } from '../login';
import { observer, Provider } from 'mobx-react';
import { NativeRouter as Router, Route } from 'react-router-native';
import { loginStore as store } from '../../stores/LoginStore';

@observer
export class Login extends Component{

    componentWillMount () {        
        BackHandler.addEventListener('hardwareBackPress', ()=> store.backHandler());
    }

    componentWillUnmount () {       
        BackHandler.removeEventListener('hardwareBackPress', ()=> store.backHandler());
    }

    render(){
        console.log(store);
        return(
            <Provider store={store} >
                <Router>
                    <View
                        style={{flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >
                        {
                            store.showBackButton &&
                                <Route  render={(props)=> { store.history=props.history;
                                                    return <BackButton {...props} /> }} />
                        }
                        { 
                            store.showLogo && 
                            <Logo />
                        }
                        { store.errorText && <ErrorText /> }

                        <Route exact path="/" component={LoginView} />
                        <Route exact path='/passrecovery' component={PassRecovery} />
                        <Route exact path='/signup' component={SignUp} />
                        <Route exact path='/activation' component={ActivationCode} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/photos' component={Photos} />
                        <Route exact path='/loggedin' component={LoggedIn} />
                        <Route exact path='/FBInfo' component={FBInfo} />
                    </View>
                </Router>
            </Provider>
        );
    }
}