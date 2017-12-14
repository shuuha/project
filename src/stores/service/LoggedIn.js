import { observable, computed, action } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import { store } from '../App';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';

let timerId;
// need to declare the background timer function outside the class to get it work correctly
const startTimer = (delay, maxTimeInBackground, appState,  fn) => {
    BackgroundTimer.clearInterval(timerId);    

    let count = delay;

    timerId = BackgroundTimer.setInterval( () => { 
        if (appState === 'background') {
            console.log('timer at work on background', delay, count);
            if (count >= maxTimeInBackground) {
                console.log(count, 'terminating connection as the limit is reached');
                store.service.loggedIn.pingIsActive = false;
                BackgroundTimer.clearInterval(timerId);
            } else { 
                fn();
            }
            count += delay;
        } else if (appState === 'active') {
            console.log('timer at work on active mode');
            fn();
        }
    }, delay);
};

const stopTimer = () => {
    BackgroundTimer.clearInterval(timerId);
};

export class LoggedIn {

    PING_DELAY_ACTIVE = 5000;
    PING_DELAY_BACKGROUND = 30000;
    PING_TIME_MULTIPLIER = 6;
    MAX_TIME_IN_BACKGROUND = 
        this.PING_DELAY_BACKGROUND * this.PING_TIME_MULTIPLIER;   

    pingIsActive = false;

    constructor(serviceStore) {
        this.serviceStore = serviceStore;
    }
    get appStore() {
        return this.serviceStore.appStore;
    }
    get menu () {
        return this.serviceStore.menu;
    }
    get navigation() {
        return this.appStore.navigation;
    }

    get geolocation() {
        return this.serviceStore.geolocation;
    }

    getUserData = () => {
        const userData = { 
            // position: { lat: this.appStore.user.lat, lng: this.appStore.user.lng },
            position: {lat: 100, lng: 100},
            online: this.appStore.user.online,
            token: this.appStore.user.token
        };
        
        return userData;
    }

    @action
    handleSuccessResponse = (res) => {
        console.log(res);
        if (res.data.success) {
            this.stopPing();
            switch (this.appStore.appState) {
                case 'active':                
                    setTimeout( ()=> {
                        this.appStore.requestAvailable = true;
                    }, 10000);

                    break;
                case 'background':
                    this.appStore.requestAvailable = true;
                    PushNotification.localNotification({
                        message: "You got a request" 
                    });

                    break;
            }
            const { request } = res.data;
            this.menu.name = request.Name;
            this.menu.price = request.Price;
            this.menu.timeStart = request.TimeStart;
            this.menu.timeLength = request.TimeLength;
            this.menu.id = request.RequestID;
        } else { 
            console.log(res);
        }
    }


    @action
    handleErrorResponse = (err) => {
        console.log('startPing function error');
        this.appStore.errorText = err;
    }

    postData = (url, data) => {
        return axios.post(url, data)
            .then( res => this.handleSuccessResponse(res))
            .catch( err => this.handleErrorResponse(err) )
    }

    getPingDelay = () => {
        if (this.appStore.appState === 'active') {
            return this.PING_DELAY_ACTIVE;
        } else {
            this.MAX_TIME_IN_BACKGROUND = 
                this.PING_DELAY_BACKGROUND * this.PING_TIME_MULTIPLIER;
            return this.PING_DELAY_BACKGROUND;            
        }
    }

    startPing = () => {
        this.pingIsActive= true;
        startTimer(
            this.getPingDelay(),
            this.MAX_TIME_IN_BACKGROUND,
            this.appStore.appState,
            () => {
                this.postData(
                    this.appStore.URL_ONLINE,
                    this.getUserData()
                )
            }
        );
    }

    stopPing = () => {
        this.pingIsActive = false;
        stopTimer();
    }   

    goOnline = () => {        
        this.appStore.loading = true;
        this.appStore.errorText = null;
        this.appStore.requestAvailable = false;
        this.geolocation.getCurrentLocation()
            .then( res => { 
                const data = {
                    position: { lat: this.appStore.user.lat, lng: this.appStore.user.lng },
                    token: this.appStore.user.token
                };
                console.log(data);

                return axios.post(this.appStore.URL_ONLINE, data);
            })
            .then( res => {
                if (res.data.success) {
                    this.appStore.user.online = true;
                    this.appStore.loading = false;
                    this.startPing();
                }
            })
            .catch((err)=> console.log( 'goOnline function error', err))
    }

    goOffline = () => {
        this.appStore.loading = true;
        const data = {
            offline: true,
            token: this.appStore.user.token
        };
        axios.post(this.appStore.URL_ONLINE, data)
            .then(res => {
                if (res.data.success) {
                    this.appStore.user.online = false;
                    this.stopPing();
                }
                    this.appStore.loading = false;                    
            })
            .catch(err => console.log('goOffline function error', err));
    }

    onOnlinePress = () => {
        if(this.appStore.user.online){
            this.goOffline();
        } else {
            this.goOnline();
        }
    }

    onTestButtonPress = () => {
        if (this.appStore.requestAvailable) {
            this.appStore.showLogo = false;
            this.navigation.levelTwo.moveTo('/menu');
        }        
    }    
}