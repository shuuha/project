import { observable, computed, action } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import { Platform } from 'react-native';

import { store } from '../App';
import axios from 'axios';

let timerId;

const startTimer = (delay, allowedTime, fn) => {
    let count = delay;
    BackgroundTimer.clearInterval(timerId);    
    timerId = BackgroundTimer.setInterval( () => {
        console.log('timer at work', delay);
        if (allowedTime) {
            if (count >= allowedTime) {
                console.log(count, 'terminating connection as the limit is reached');
                store.service.loggedIn.pingIsActive = false;
                BackgroundTimer.clearInterval(timerId);
            } else { 
                fn();
            }
            count += delay;
        } else {
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
    PING_TIME_ALLOWED_IN_BACKGROUND = 
        this.PING_DELAY_BACKGROUND * this.PING_TIME_MULTIPLIER;
    CURRENT_LOCATION_CONFIG_TIMEOUT = 10000;

    constructor(serviceStore){
        this.serviceStore = serviceStore;
    }

    pingIsActive = false;

    get appStore(){
        return this.serviceStore.appStore;
    }

    get navigation(){
        return this.appStore.navigation;
    }

    getCurrentLocation = () => {
        const promise = new Promise((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(({coords}) => {
                const { latitude, longitude } = coords;
                // this.appStore.user.lat = latitude;
                // this.appStore.user.lng = longitude;
                this.appStore.user.lat = 100;
                this.appStore.user.lng = 100;
                resolve(coords);
            },
            (error) => {
                this.appStore.loading = false;
                this.appStore.errorText = 'No location provider available';
                console.log(JSON.stringify(error));
                reject(error)},
            {timeout: this.CURRENT_LOCATION_CONFIG_TIMEOUT} 
            );
        });

        return promise;
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

    postData = (url, data) => {
        return axios.post(url, data)
            .then((res) => console.log(res.data))
            .catch((err)=> {
                console.log('startPing function error');
                this.appStore.errorText = err;
            })
    }

    getPingDelay = () => {
        if (this.appStore.appState === 'active') {
            this.PING_TIME_ALLOWED_IN_BACKGROUND = null;
            return this.PING_DELAY_ACTIVE;
        } else {
            this.PING_TIME_ALLOWED_IN_BACKGROUND = 
                this.PING_DELAY_BACKGROUND * this.PING_TIME_MULTIPLIER;
            return this.PING_DELAY_BACKGROUND;            
        }
    }

    startPingAndroid = () => {
        this.pingIsActive= true;
        startTimer(
            this.getPingDelay(),
            this.PING_TIME_ALLOWED_IN_BACKGROUND,
            () => {
                this.postData(
                    this.appStore.URL_ONLINE,
                    this.getUserData()
                )
            }
        );
    }

    startPingIOS = () => {
        console.log('start ping ios');
        BackgroundTimer.start();
        this.timerId = setInterval(()=> {
            this.postData(this.appStore.URL_ONLINE, this.getUserData());            
        }, this.PING_DELAY);
    }

    stopPingAndroid = () => {
        this.pingIsActive = false;
        stopTimer();
    }

    stopPingIOS = () => {
        // BackgroundTimer.stop();
        clearInterval(this.timerId);
    }

    startPing = () => {
        // if (Platform.OS === 'ios') {
        //     this.startPingIOS();
        // } else {
            this.startPingAndroid();
        // }

    }

    stopPing = () => {
        // if (Platform.OS = 'ios') {
        //     this.stopPingIOS();
        // } else {
            this.stopPingAndroid();
        // }
    }

    goOnline = () => {
        this.startPing();
        // this.appStore.loading = true;
        // this.appStore.errorText = true;
        // this.getCurrentLocation()
        //     .then(()=> { 
        //         const data = { 
        //             position: { lat: this.appStore.user.lat, lng: this.appStore.user.lng },
        //             token: this.appStore.user.token
        //         };
        //         console.log(data);
        //         return axios.post(this.appStore.URL_ONLINE, data);
        //     })
        //     .then((res)=> {
        //         if(res.data.success){
        //             this.appStore.user.online = true;
        //             this.appStore.loading = false;

        //             // this.timerId = BackgroundTimer.setInterval(()=>{
        //             //     this.postData(this.appStore.URL_ONLINE, this.getUserData());
        //             // }, this.PING_DELAY);

        //             this.startPing();
        //         }
        //     })
        //     .catch((err)=> console.log( 'goOnline function error', err))
    }

    goOffline = () => {

        // this.appStore.loading = false;
        // this.appStore.user.online = false;
        // this.stopPing();
        // this.appStore.loading = true;
        // const data = {
        //     goOffline: true,
        //     token: this.appStore.user.token
        // };
        // axios.post(this.appStore.URL_ONLINE, data)
        //     .then(res => {
        //         console.log(res);
        //         if(res.data.success){
        //             this.appStore.user.online = false;
        //             this.appStore.loading = false;
        //         }
        //     })
        //     .catch(err => console.log('goOffline function error', err));
    }

    onOnlinePress = () => {
        if(this.appStore.user.online){
            this.goOffline();
        } else {
            this.goOnline();
        }
    }

    onTestButtonPress = () => {
        // this.appStore.showLogo = false;
        // this.navigation.levelTwo.moveTo('/menu');
        axios.post(this.appStore.URL_AUTH, { token: this.appStore.user.token })
            .then(res => console.log(res))
            .catch( err => console.log(err));
    }

    clearToken = () => {
        console.log('timer is cleared');
        stopTimer();
        // this.appStore.removeTokenFromStorage();
    }
}