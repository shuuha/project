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
    onChangeName = (value) => {
        this.fullnameError = false;
        this.fullname = value;
    }

    @action
    onChangeCode = (value) => {
        this.codeValueError = false;
        this.codeValue = value;
        if(this.codeValue.length == 0){
            this.codeValue = '+';
        }
    }

    @action
    onChangePhone = (value) => {
        this.phoneValueError = false;
        this.phoneValue = value;
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
        if (this.codeValue.length == 0) {
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

    handleSuccessResponse = (res) => {
        this.appStore.user.token = res.data.token;
        this.appStore.signUpProcedure = true;
        this.savedPhoneValue = this.phoneValue;
        this.loginStore.phoneVerified = false;
        this.navigation.levelTwo.moveTo('/smsconfirm');
    }

    sendData = (data) => {
        axios.post(this.appStore.URL_NEWUSER, data)
            .then(res => {
                if (res.data.success) {
                    this.handleSuccessResponse(res);
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
                // 420 773194752
        }
    }

    onSendPress = () => {
        if (!this.fullname) {
            this.onError('fullname');
        } else if (!this.codeValue) {
            this.onError('codeValue');
        } else if (!this.phoneValue) {
            this.onError('phoneValue');
        } else if (this.phoneIsNotResubmitted()) {
            if (this.loginStore.phoneVerified) {
                this.navigation.levelTwo.moveBackCount = 1;
                this.navigation.levelTwo.moveTo('/register');
            } else {
                this.navigation.levelTwo.moveTo('/smsconfirm');
            }
        } else {
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