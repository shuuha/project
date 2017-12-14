import { observable, computed, action } from 'mobx';
import axios from 'axios';

export class Main {

    @observable email = '';
    @observable pass = '';
    @observable emailError = false;
    @observable passError = false;    
    @observable shakeTrigger = false;    

    initialRender = true;
    timerId;
    refs;
    Vibration;

    constructor(loginStore) {
        this.loginStore = loginStore;        
    }

    get appStore() {
        return this.loginStore.appStore;
    }

    get navigation() {
        return this.appStore.navigation;
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
        this.appStore.errorText = null
    }

    ifPropHasNoValue = (prop) => {
        this[prop + 'Error'] = true;
        this.shakeTrigger = true;
        this.Vibration.vibrate([300, 100]);
        this.refs[prop].focus();
    }

    @action
    setUserInfo = (res) => {
        this.appStore.user.token = res.data.token;
        this.appStore.user.loggedIn = true;
        this.appStore.user.email = this.email;
        this.appStore.user.pass = this.pass;
    }   

    @action
    postData = (data) => {
        return axios.post(this.appStore.URL_AUTH, data)
        .then((res)=> {
            console.log(res);
            if (res.data.token) {
                this.setUserInfo(res);
                
                return this.appStore.token.saveToStorage()
                    .then(res => {
                        this.appStore.loading = false;
                        console.log(res)})
                    .then(() => this.navigation.levelOne.moveTo('/service'))
            } else {
                this.emailError = true;
                this.passError = false;
                this.pass = '';
                this.Vibration.vibrate([300, 100]);
                this.refs.pass.focus();
                this.appStore.errorText = res.data.message;
                this.appStore.loading = false;
            }            
        })
        
        .catch(err=> {
            console.log(err, 'error while login in with the existing login credentials');
            this.appStore.errorText = 'Network error';
            this.appStore.loading = false;
        });
    }

    @action
    onLoginButtonPress = () => {
        if (!this.email) {
            this.ifPropHasNoValue('email');
        } else if (!this.pass) {
            this.ifPropHasNoValue('pass');
        } else if (!this.emailError && !this.passError) {
            this.appStore.loading = true;
            this.appStore.errorText = null;            

            const userCredentials = {
                user: this.email,
                pass: this.pass + ''                
            };            
            this.postData(userCredentials);
        }
    }

    onForgotPassPress = () => {
        this.appStore.errorText = null;
        this.navigation.levelTwo.moveTo('/restorepass'); 
    }

    onSignUpPress = () => {
        this.appStore.errorText = null;
        this.navigation.levelTwo.moveTo('/signup');        
    }

    onEnterPhoneNo = () => {
        this.navigation.levelTwo.moveTo('/smsconfirm');
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
        if (res.data.token) {
            this.appStore.user.token = res.data.token;
        } else {
            this.appStore.errorText = res.data.message;
        }
    }

    onLoginWithFbButtonPress = (error, data) => {
        const profile = JSON.parse(data.profile);
        const facebookData = this.createFacebookData(data, profile);
        return axios.post(this.appStore.URL_AUTH, facebookData)
            .then((res)=> {
            // return localStorage.merge('facebookData', facebookData) 
            //         .then(()=> localStorage.get('facebookData'))
            //         .then(data => axios.post(this.appStore.URL_AUTH, data))
            //         .catch((err) => console.log('local storage i/o error', err));
            })
            .then((res)=> this.handleSuccess(res))
            .catch((err) => {
                this.appStore.errorText = 'Network error';
                console.log(err);
            });
    }

    onSubmitEmail = (nextInput) => {
        nextInput.focus();
    } 

    onSubmitPass = () => {
        this.onLoginButtonPress();
    }
}