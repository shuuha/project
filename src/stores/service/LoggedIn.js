import { observable, computed, action } from 'mobx';
import axios from 'axios';

export class LoggedIn{
    timerId;

    constructor(serviceStore){
        this.serviceStore = serviceStore;
    }

    get appStore(){
        return this.serviceStore.appStore;
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
            {timeout: 10000} 
            );
        });
        return promise;
    }  
    
    stopPing = () => {
        clearInterval(this.timerId); 
    }

    startPing = () => {
        const userData = { 
            position: { lat: this.appStore.user.lat, lng: this.appStore.user.lng },
            // position: {lat: 100, lng: 100},
            online: this.appStore.user.online,
            token: this.appStore.user.token
        };
        this.timerId = setInterval(()=>{
            axios.post(this.appStore.URL_ONLINE, userData)
                // .then((res) => console.log(res.data))
                .catch((err)=> {
                    console.log('startPing function error');
                    this.appStore.errorText = err;
                });
        }, 5000);
    }


    goOnline = () => {
        this.appStore.loading = true;
        this.appStore.errorText = true;
        this.getCurrentLocation()
            .then(()=> { 
                const data = { 
                    position: { lat: this.appStore.user.lat, lng: this.appStore.user.lng },
                    token: this.appStore.user.token
                };
                console.log(data);
                return axios.post(this.appStore.URL_ONLINE, data);
            })
            .then((res)=> {
                if(res.data.success){
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
            goOffline: true,
            token: this.appStore.user.token
        };
        axios.post(this.appStore.URL_ONLINE, data)
            .then(res => {
                console.log(res);
                if(res.data.success){
                    this.appStore.user.online = false;
                    this.appStore.loading = false;
                    this.stopPing();
                }
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
}