import { observable, computed, action } from 'mobx';
import localStorage from 'react-native-local-storage';
import axios from 'axios';

export class LoginView{

    @observable email = '';
    @observable pass = '';
    @observable emailError = false;
    @observable passError = false;
    @observable userOnline = false;
    @observable shakeTrigger = false;    

    isLoginViewInitialRender = true;
    timerId;
    refs;
    Vibration;

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    onChangeEmail = (text) => {
        this.emailError = false;
        this.email = text;
    }

    @action
    onChangePass = (text) => {
        this.passError = false;
        this.emailError = false;
        this.pass = text;
    }

    @action
    onInputFocus = () => {
        this.loginStore.errorText = null
    }

    ifPropHasNoValue = (prop) => {
            this[prop + 'Error'] = true;
            this.shakeTrigger = true;
            this.Vibration.vibrate([300, 100]);
            this.refs[prop].focus();
    }

    @action
    onLoginButtonPress = () => {
        if(!this.email){ 
            this.ifPropHasNoValue('email');
        } 
        else if(!this.pass){
            this.ifPropHasNoValue('pass');
        }
        else if(!this.emailError && !this.passError){
            this.loginStore.loading = true;
            this.loginStore.errorText = null;
            const config = {
                headers: {
                    // 'Content-Type': 'application/json', 
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                },
            };

            const userCredentials = {
                user: this.email,
                pass: this.pass + ''
                // user: 'othertest',
                // pass: 1234 + ''
            };

            axios.post(this.loginStore.URL_AUTH, userCredentials/*, config*/)
                .then((res)=>{
                    if(res.data.token){
                        this.loginStore.token = res.data.token;
                        this.loginStore.showBackButton = false;
                        this.loginStore.loggedIn = true;
                        this.loginStore.history.push('/loggedin');
                    }
                    else {
                        this.emailError = true;
                        this.passError = false;
                        this.pass = '';
                        this.Vibration.vibrate([300, 100]);
                        this.refs.pass.focus();
                        // this.loginStore.errorText = res.data.message;
                    }
                    this.loginStore.loading = false;
                })
                .catch((err)=> {
                    this.loginStore.errorText = 'Network error';
                    this.loginStore.loading = false;
                });
        }

    }

    onForgotPassPress = () => {
        this.loginStore.errorText = null;
        this.loginStore.history.push('/passrecovery'); 
    }

    onSignUpPress = () => {
        this.loginStore.errorText = null;
        this.loginStore.history.push('/signup');        
    }

    onEnterPhoneNo = () => {
        this.loginStore.history.push('/activation');
    }
    
    createFacebookData = (data, profile) => {
        return {
            id: data.credentials.userId,
            token: data.credentials.token,
            email: profile.email,
            name: profile.name,
            imageUrl: profile.picture.data.url
        };        
    }

    handleSuccess = (res) => {
        if(res.data.token){
            this.loginStore.token = res.data.token;
            this.loginStore.history.push('/FBInfo');
        }
        else {
            this.loginStore.errorText = res.data.message;
        }
    }

    onLoginWithFbButtonPress = (error, data) => {

        this.getCurrentLocation()
            .then((res)=> {
                const profile = JSON.parse(data.profile);
                this.createFacebookData(data, profile);
            // return localStorage.merge('facebookData', facebookData) 
            //         .then(()=> localStorage.get('facebookData'))
            //         .then(data => axios.post(this.loginStore.URL_AUTH, data))
            //         .catch((err) => console.log('local storage i/o error', err));
                return axios.post(this.loginStore.URL_AUTH, facebookData);
            })
            .then((res)=> this.handleSuccess())
            .catch((err) => {
                this.loginStore.errorText = 'Network error';
                console.log(err);
            });
    }

    onSubmitEmail = (nextInput) => {
        nextInput.focus();
    } 

    onSubmitPass = () => {
        this.onLoginButtonPress();
    }

    getCurrentLocation = () => {
        const promise = new Promise((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(({coords}) => {
                const { latitude, longitude } = coords;
                // this.loginStore.lat = latitude;
                // this.loginStore.lng = longitude;
                this.loginStore.lat = 100;
                this.loginStore.lng = 100;
                resolve(coords);
            },
            (error) => {
                this.loginStore.loading = false;
                this.loginStore.errorText = 'No location provider available';
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
            // position: { lat: this.loginStore.lat, lng: this.loginStore.lng },
            position: {lat: 100, lng: 100},
            online: this.userOnline,
            token: this.loginStore.token
        };
        this.timerId = setInterval(()=>{
            axios.post(this.loginStore.URL_ONLINE, userData)
                // .then((res) => console.log(res.data))
                .catch((err)=> {
                    console.log('startPing function error');
                    this.loginStore.errorText = err;
                });
        }, 5000);
    }


    goOnline = () => {
        this.loginStore.loading = true;
        this.loginStore.errorText = true;
        this.getCurrentLocation()
            .then(()=> { 
                const data = { 
                    position: { lat: this.loginStore.lat, lng: this.loginStore.lng },
                    token: this.loginStore.token
                };
                console.log(data);
                return axios.post(this.loginStore.URL_ONLINE, data);
            })
            .then((res)=> {
                if(res.data.success){
                    this.userOnline = true;
                    this.loginStore.loading = false;
                    this.startPing();
                }
            })
            .catch((err)=> console.log( 'goOnline function error', err))
    }

    goOffline = () => {
        this.loginStore.loading = true;
        const data = {
            goOffline: true,
            token: this.loginStore.token
        };
        axios.post(this.loginStore.URL_ONLINE, data)
            .then(res => {
                console.log(res);
                if(res.data.success){
                    this.userOnline = false;
                    this.loginStore.loading = false;
                    this.stopPing();
                }
            })
            .catch(err => console.log('goOffline function error', err));
    }

    onOnlinePress = () => {
        if(this.userOnline){
            this.goOffline();
        } else {
            this.goOnline();
        }
        
    }
}