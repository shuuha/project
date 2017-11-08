import { observable, computer, action } from 'mobx';
import axios from 'axios';

export class LoginView{

    @observable email = '';
    @observable pass = '';
    @observable userOnline = false;

    isLoginViewInitialRender = true;
    token = '';

    URL_AUTH = 'http://app.yayintel.com:8883/api/authenticate';
    URL_ONLINE = 'http://app.yayintel.com:8883/api/online';

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    onChangeEmail = (e) => {
        this.email = e;
    }

    @action
    onChangePass = (p) => {
        this.pass = p;
    }

    @action
    onInputFocus = () => {
        this.loginStore.errorText = null
    }

    onLoginButtonPress = () => {
        this.loginStore.loading = true;
        this.loginStore.errorText = null;
        const config = {
            headers: {
                'Content-Type': 'application/json', 
            },
        };

        const userCredentials = {
            user: this.email,
            pass: this.pass + ''
        };

        axios.post(this.URL_AUTH, userCredentials, config)
            .then((res)=>{
                if(res.data.token){
                    this.token = res.data.token;                
                    this.loginStore.history.push('/loggedin');
                }
                else {
                    this.loginStore.errorText = res.data.message;
                }
                this.loginStore.loading = false;
            })
            .catch((err)=> {
                this.loginStore.errorText = 'Network error';
                this.loginStore.loading = false;
            });
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
    
    onLoginWithFbButtonPress = () => {
        
    }   

    onSubmitEmail = (input) => {
        input.focus();
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
                    token: this.token
                };
                return axios.post(this.URL_ONLINE, data)
            })
            .then((res)=> {
                if(res.data.success){
                    this.userOnline = true;
                    this.loginStore.loading = false;
                }
            })
            .catch((err)=> console.log(err))
    }
}