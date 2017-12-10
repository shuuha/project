import { observable, computed, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

export class Token {

    constructor(appStore) {
        this.appStore = appStore;
    }

    saveToStorage = () => {
        return AsyncStorage.setItem('token', this.appStore.user.token)
            .catch( err => console.log(err));
    }

    getFromStorage = () => {
        return AsyncStorage.getItem('token')            
            .catch(err => console.log(err));
    }

    removeFromStorage = () => {
        return AsyncStorage.removeItem('token')
            .catch(err => console.log(err));
    }

    getUserData = (token) => {        
        return {
            token,
            position: {
                lat: this.appStore.user.lat || "0",
                lng: this.appStore.user.lng || "0"
            }
        };
    }

    verifyOnServer = (token) => {
        console.log(this.getUserData(token));
        return axios.post(this.appStore.URL_ONLINE, this.getUserData(token))
            .then( res => {
                if (res.data.success) {
                    this.appStore.user.loggedIn = true;
                    this.appStore.showLogoAnimation = false;
                } 
                console.log(res.message);
                this.appStore.loadingOnTokenCheck = false;
            })
            .catch(err => {
                console.log('error while verifying token on the server ', err);
                this.appStore.loadingOnTokenCheck = false;
                this.appStore.showLogoAnimation = false;
                this.appStore.errorText = 'Network error, please check you internet connection';
            })
    }
}