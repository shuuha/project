import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Dimensions,
    StatusBar,
    AppState
} from 'react-native';

import { 
    NativeRouter as Router, 
    Route, 
    Switch,
    Redirect 
} from 'react-router-native';

import { observer, Provider } from 'mobx-react/native';
import { store } from './stores/App';
// import { Page, MapAndDraw, Camera } from './components';
import { 
    Login, 
    Service, 
    ErrorText, 
    BackButton, 
    Loading 
} from './components';

@observer
export default class App extends Component{

    componentWillMount(){
        store.appInit();
    }

    componentDidMount(){
        store.appState = AppState.currentState;
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        console.log(nextAppState);
        store.handleAppStateChange(nextAppState);
    }

    render(){
        console.log(' render ' );
        const { levelOne } = store.navigation;
        // const { pages, dataLoaded } = store;
        return(
            store.loadingOnTokenCheck
            ?
            <Loading />
            :
            <Provider store={store} >
                <Router>
                    <View
                        style={{ flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >
                        <StatusBar 
                            backgroundColor='rgb(25, 58, 101)'
                            barStyle="light-content"
                        />
                        <ErrorText />

                        <Switch>                            
                            <Route exact path='/' render={(props) => {
                                levelOne.history = props.history;
                                if(store.user.loggedIn) {
                                    return <Redirect to='/service' />
                                }
                                return <Login />
                            }} />
                            <Route path='/service' render={(props) => {                                
                                return <Service />
                            }} />
                        </Switch>
                        <BackButton />
                    </View>
                </Router>
            </Provider>
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
