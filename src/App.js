import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Dimensions,
    NetInfo, 
    StatusBar 
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
import { Login, Service, ErrorText, BackButton } from './components';

@observer
export default class App extends Component{

    render(){
        console.log(' render ' );
        // const { pages, dataLoaded } = store;
        return(
            <Provider store={store} >
                <Router>
                    <View
                        style={{ flex: 1, backgroundColor: 'rgb(25, 58, 101)'}}
                    >
                        <StatusBar 
                            backgroundColor='rgb(25, 58, 101)'
                            barStyle="light-content"
                        />
                        <BackButton />                        
                        <ErrorText />

                        <Switch>                            
                            <Route exact path='/' render={(props) => {
                                store.appHistory=props.history;
                                if(store.user.loggedIn) {
                                    return <Redirect to='/service' />
                                }
                                return <Login />
                            }} />
                            <Route path='/service' render={(props) => {
                                store.appHistory=props.history;
                                return <Service />
                            }} />
                        </Switch>
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
