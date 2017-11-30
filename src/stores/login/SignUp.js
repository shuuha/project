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

    refs;
    savedPhoneValue;
    phoneIsVerified = false;
    Vibration;

    constructor(loginStore){
        this.loginStore = loginStore; 
    }


    get appStore(){
        return this.loginStore.appStore;
    }

    get navigation(){
        return this.appStore.navigation;
    }

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
        this.appStore.errorText = null;
    }

    @action
    onCodeFocus = () => {
        this.appStore.errorText = null;
        if(this.codeValue.length == 0){
            this.codeValue = '+'
        }
    }

    @action
    onPhoneFocus = () => { 
        this.appStore.errorText = null;
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

    sendData = (data) => {
        axios.post(this.loginStore.appStore.URL_NEWUSER, data)
            .then(res => {
                if(res.data.success){
                    this.loginStore.token = res.data.token;
                    this.savedPhoneValue = this.phoneValue;
                    this.loginStore.phoneVerified = false;
                    this.navigation.levelTwo.moveTo('/activation');
                } else {
                    this.appStore.errorText = res.data.message;    
                }
                    this.appStore.loading = false;                
            })
            .catch(err => {
                this.appStore.loading = false;
                this.appStore.errorText = 'Network error';
                console.log(err, 'sendUserData function error')});
    }

    saveUserInfo = () => {
        this.appStore.user.phone = this.codeValue + this.phoneValue;
        this.appStore.user.fullname = this.fullname;
    }

    getPhoneAndName = () => {
        return {
                name: this.fullname,
                phon: this.codeValue + this.phoneValue
                // 420 773186737
        }
    }

    onSendPress = () => {
        if(!this.fullname){
            this.onError('fullname');
        } 
        else if(!this.codeValue){
            this.onError('codeValue');
        } 
        else if(!this.phoneValue){
            this.onError('phoneValue');
        }        
        else if (this.phoneIsNotResubmitted()){
            if(this.loginStore.phoneVerified){
                this.navigation.levelTwo.moveBackCount = 1;
                this.navigation.levelTwo.moveTo('/register');
            }
            else {
                this.navigation.levelTwo.moveTo('/activation');
            }
        }
        else {
            this.appStore.loading = true;
            this.saveUserInfo();
            this.sendData(this.getPhoneAndName());
        }
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