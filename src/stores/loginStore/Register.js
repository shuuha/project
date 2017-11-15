import { observable, computed, action } from 'mobx';
import localStorage from 'react-native-local-storage';
import axios from 'axios';
import { Photos } from './register';

const NUMBERS = '0123456789';

export class Register{

    @observable email = '';
    @observable pass = '';
    @observable passConfirm = '';
    @observable _avatarImageUri;
    @observable emailError = false;
    @observable passError = false;
    @observable passConfirmError = false;
    @observable shakeTrigger = false;

    photos = new Photos(this);   

    refs;
    Vibration;

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    setInitialState = () => {
        // this.emailValidError = false;
        // this.passValidError = false;
        // this.passConfirmValidError = false;
        this.loginStore.loading = false;
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
    get isEmailValid(){
        let i, tail, dot;

        if(this.email.includes('@')){
            i = this.email.indexOf('@');
            tail = this.email.slice(++i);
            dot = tail.indexOf('.');            
        }
        const result = dot >= 2 && tail.length - dot >= 3

        return result;
    }

    @computed
    get isPassValid(){
        const valid = this.pass.length >=8 && this.pass.split('').some(q => NUMBERS.includes(q));
        return valid;
    }

    @computed 
    get isPassConfirmValid(){
        return this.pass.length != 0 && this.pass === this.passConfirm;
    }

    @computed
    get inputsAreValid(){
        return this.isEmailValid && this.isPassValid && this.isPassConfirmValid;
    }
     
    onError = (propName) => {
        this[propName + 'Error'] = true;
        this.shakeTrigger = true;
        this.Vibration.vibrate([300, 100]);
        this.refs[propName].focus();
    }

    @action
    onRegisterPress = () => {
        if(!this.isEmailValid){
            this.emailError = true;
            this.onError('email');
        }
        else if(!this.isPassValid){
            this.passError = true;
            this.onError('pass');
        }
        else if(!this.isPassConfirmValid){
            this.passConfirmError = true;
            this.onError('passConfirm');
        }        
        else if(this.inputsAreValid){
            this.loginStore.loading = true;
            const data = {
                token: this.loginStore.token,
                mail: this.email,
                pass: this.pass
            };
            axios.post(this.loginStore.URL_NEWUSER, data)
                .then(res => { 
                    console.log(res);
                    if(res.data.success){
                        this.loginStore.token = res.data.token;
                    return localStorage.save('serverToken', this.loginStore.token)
                    }
                    else {
                        console.log('no successfull response');
                        return;                        
                    }
                })
                .then(() => {
                    return localStorage.get('serverToken')
                            .then((res) => console.log(res))
                            .then(()=> {
                                console.log('registration complete');
                                this.loginStore.showLogo = true;
                                this.loginStore.loading = false;
                                this.loginStore.showBackButton = false;
                                this.loginStore.history.push('/loggedin')})
                            .catch((e)=> console.log(e, 'register, local storage'))
                })
                .catch(err => {
                    this.loginStore.loading = false;
                    this.loginStore.errorText = 'Network error';
                    console.log(err, 'register, on register press')})
        }        
    }    

    @action
    onInputFocus = () => {
        this.setInitialState();
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
        this.loginStore.history.push('/photos')
    }

}