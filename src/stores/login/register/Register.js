import { observable, computed, action } from 'mobx';
import axios from 'axios';
import { Photos } from '../register';

const NUMBERS = '0123456789';

export class Register {

    refs;
    Vibration;

    @observable email = '';
    @observable pass = '';
    @observable passConfirm = '';
    @observable _avatarImageUri;
    @observable emailError = false;
    @observable passError = false;
    @observable passConfirmError = false;
    @observable shakeTrigger = false;

    constructor(loginStore) {
        this.loginStore = loginStore;
    }

    photos = new Photos(this);

    get appStore() {
        return this.loginStore.appStore;
    }

    get navigation() {
        return this.appStore.navigation;
    }

    get token() {
        return this.appStore.token;
    }

    @action
    onChangeEmail = (e) => {
        this.email = e;
        this.emailError = false;
    }

    @action
    onChangePass = (e) => {
        this.pass = e;
        this.passError = false;
        this.passConfirmError = false;
    }

    @action
    onChangePassConfirm = (e) => {
        this.passConfirm = e;
        this.passError = false;
        this.passConfirmError = false;
    }

    @computed
    get isEmailValid() {
        let i;
        let tail;
        let dot;
        
        if (this.email.includes('@')) {
            i = this.email.indexOf('@');
            tail = this.email.slice(++i);
            dot = tail.indexOf('.');            
        }

        const result = dot >= 2 && tail.length - dot >= 3
        return result;
    }

    @computed
    get isPassValid() {
        const valid = this.pass.length >=8 && 
            this.pass.split('').some(q => NUMBERS.includes(q));
        return valid;
    }

    @computed 
    get isPassConfirmValid() {
        return this.pass.length != 0 && this.pass === this.passConfirm;
    }

    @computed
    get inputsAreValid() {
        return this.isEmailValid && this.isPassValid && this.isPassConfirmValid;
    }    
     
    onError = (propName) => {
        this[propName + 'Error'] = true;
        this.shakeTrigger = true;
        this.Vibration.vibrate([300, 100]);
        this.refs[propName].focus();
    }

    saveUserInfo = (token) => {
        this.appStore.user.email = this.email;
        this.appStore.user.pass = this.pass;
        this.appStore.user.token = token;
    }

    getUserInfo = () => {
        return {
            token: this.appStore.user.token,
            mail: this.email,
            pass: this.pass
        }
    }

    postData = () => {
        return axios.post(this.appStore.URL_NEWUSER, this.getUserInfo())
            .then(res => { 
                console.log(res);
                if (res.data.success) {
                    this.saveUserInfo(res.data.token);
                    return this.token.saveToStorage('token', this.appStore.user.token);
                } else {
                    this.appStore.errorText = res.data.message;
                    throw new Error(res.data.message);
                }
            })
            .then( () => {                    
                this.appStore.showLogo = true;                    
                this.appStore.loading = false;
                this.appStore.user.loggedIn = true;
                this.navigation.levelOne.moveTo('/service');
            })
            .catch(err => {
                this.appStore.loading = false;
                this.appStore.errorText = 'Network error';
                console.log(err, 'register, on register press');
            })
    }

    @action
    onRegisterPress = () => {
        if (!this.isEmailValid) {
            this.emailError = true;
            this.onError('email');
        } else if (!this.isPassValid) {
            this.passError = true;
            this.onError('pass');
        } else if (!this.isPassConfirmValid) {
            this.passConfirmError = true;
            this.onError('passConfirm');
        } else if (this.inputsAreValid) {
            this.appStore.loading = true;
            this.postData();            
        }
    }

    @action
    onInputFocus = () => {
        this.appStore.setInitialState();
    }

    onTosPress = () => {
        console.log('loading tos page');
    }

    onSubmitEmail = (nextInput) => {
        nextInput.focus();
    }

    onSubmitPass = (nextInput) => {
        nextInput.focus();
    }

    onSubmitPassConfirm = () => {
        this.onRegisterPress();
    }

    onAvatarPress = () => {
        this.navigation.levelTwo.moveTo('/photos');
    }
}