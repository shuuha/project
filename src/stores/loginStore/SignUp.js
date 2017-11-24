import { observable, computed, action } from 'mobx';
import axios from 'axios';

export class SignUp{

    @observable fullname = '';
    @observable codeValue = '';
    @observable phoneValue = ''; 
    @observable fullnameError = false;
    @observable codeValueError = false;
    @observable phoneValueError = false;
    @observable shakeTrigger = false;

    constructor(loginStore){
        this.loginStore = loginStore; 
    }

    refs;
    savedPhoneValue;
    phoneIsVerified = false;
    Vibration;

    @action
    onChangeName = (e) => {
        this.fullnameError = false;
        this.fullname = e;
    }

    @action
    onChangeCode = (e) => {
        this.codeValueError = false;
        this.codeValue = e;
        if(this.codeValue.length == 0){
            this.codeValue = '+';
        }
    }

    @action
    onChangePhone = (e) => {
        this.phoneValueError = false;
        this.phoneValue = e;
    }

    @action
    onBlur = () => {
        if(this.codeValue.length == 1){
            this.codeValue = '';
        }
    }

    @action
    onFullnameFocus = () => {
        this.loginStore.errorText = null;
    }

    @action
    onCodeFocus = () => {
        this.loginStore.errorText = null;
        if(this.codeValue.length == 0){
            this.codeValue = '+'
        }
    }

    @action
    onPhoneFocus = () => { 
        this.loginStore.errorText = null;
    }

    onError = (propName) => {
        const propNameUpper = propName[0].toUpperCase() + propName.slice(1);
        this[propName + 'Error'] = true;
        this.shakeTrigger = true;
        this.Vibration.vibrate([300, 100]);
        this.refs['input' + propNameUpper].focus(); 
    }    

    phoneIsNotResubmitted = () => {
        return this.phoneValue === this.savedPhoneValue;
    }    

    sendPhoneAndName = (data) => {
        axios.post(this.loginStore.URL_NEWUSER, data)
            .then(res => {
                if(res.data.success){
                    this.loginStore.token = res.data.token;
                    this.savedPhoneValue = this.phoneValue;
                    this.loginStore.phoneVerified = false;
                    this.loginStore.history.push('/activation');
                } else {
                    this.loginStore.errorText = res.data.message;    
                }
                    this.loginStore.loading = false;                
            })
            .catch(err => {
                this.loginStore.loading = false;
                this.loginStore.errorText = 'Network error';
                console.log(err, 'sendUserData function error')});
    }

    getPhoneAndName = () => {
        return {
                name: this.fullname,
                phon: this.codeValue + this.phoneValue
                // 420 773186737
        }
    }

    onSendPress = () => {
        this.loginStore.history.push('/activation');
        // if(!this.fullname){
        //     this.onError('fullname');
        // } 
        // else if(!this.codeValue){
        //     this.onError('codeValue');
        // } 
        // else if(!this.phoneValue){
        //     this.onError('phoneValue');
        // }        
        // else if (this.phoneIsNotResubmitted()){
        //     if(this.loginStore.phoneVerified){
        //         this.loginStore.moveBackCount = 1;
        //         this.loginStore.history.push('/register');
        //     }
        //     else {
        //         this.loginStore.history.push('/activation');
        //     }
        // }
        // else {
        //     this.loginStore.loading = true;
        //     this.sendPhoneAndName(this.getPhoneAndName());
        // }
    }

    onNameSubmitPress = () => {
        this.refs.inputCodeValue.focus();
    }

    onCodeSubmitPress = () => {
        this.refs.inputPhoneValue.focus();
    }

    onPhoneSubmitPress = () => {
        this.onSendPress();
    }
}