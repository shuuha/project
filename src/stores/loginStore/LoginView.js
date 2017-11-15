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

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    stopPing = () => {
        clearInterval(this.timerId);
    }

    startPing = () => {
        const data = { 
            // position: { lat: this.loginStore.lat, lng: this.loginStore.lng },
            position: {lat: 100, lng: 100 },
            token: this.loginStore.token
        };
        this.timerId = setInterval(()=>{
            axios.post(this.loginStore.URL_ONLINE, data)
                // .then((res) => console.log(res.data))
                .catch((err)=> this.loginStore.errorText = err);
        }, 5000)
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

    @action
    onLoginButtonPress = (refs, Vibration) => {
        if(!this.email){ 
            this.emailError = true;
            this.shakeTrigger = true;
            Vibration.vibrate([300, 100]);
            refs.email.focus();
        }
        else if(!this.pass){
            this.passError = true;
            this.shakeTrigger = true;
            Vibration.vibrate([300, 100]);
            refs.pass.focus();
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
                        this.loginStore.history.push('/loggedin');
                    }
                    else {
                        this.emailError = true;
                        this.passError = false;
                        this.pass = '';
                        Vibration.vibrate([300, 100]);
                        refs.email.focus();
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
    
    onLoginWithFbButtonPress = (error, data) => {

        this.getCurrentLocation()
            .then((res)=> {
                const profile = JSON.parse(data.profile);
                const facebookData = {
                    id: data.credentials.userId,
                    token: data.credentials.token,
                    email: profile.email,
                    name: profile.name,
                    imageUrl: profile.picture.data.url
                };

            return localStorage.merge('facebookData', facebookData) 
                    .then(()=> localStorage.get('facebookData'))
                    .then(data => axios.post(this.loginStore.URL_AUTH, data))
                    .catch((err) => console.log('local storage i/o error', err));
            })
            .then((res)=> {
                if(res.data.token){
                    this.loginStore.token = res.data.token;
                    this.loginStore.history.push('/FBInfo');
                }
                else {
                    this.loginStore.errorText = res.data.message;
                }
            })            
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
                this.loginStore.lat = latitude;
                this.loginStore.lng = longitude;
                resolve(coords);
            },
            (error) => {
                console.log(JSON.stringify(error));
                reject(error)},
            {timeout: 10000} 
            );
        });
        return promise;
    }    

    onOnlinePress = () => {
        this.loginStore.loading = true;
        this.getCurrentLocation()
            .then(()=> { 
                const data = { 
                    position: { lat: this.loginStore.lat, lng: this.loginStore.lng },
                    token: this.loginStore.token
                };
                return axios.post(this.loginStore.URL_ONLINE, data)
            })
            .then((res)=> {
                if(res.data.success){
                    this.userOnline = true;
                    this.loginStore.loading = false;
                    this.startPing();
                }
            })
            .catch((err)=> console.log(err))
    }
}