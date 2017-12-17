import { observable, computed, action } from 'mobx';
import axios from 'axios';
import { Vibration } from 'react-native';

export class RestorePass {

    refs = {};
    submittedPhone;
    submittedEmail;
    submittedCode;

    @observable email = '';
    @observable code = '';
    @observable phone = '';
    @observable emailError = '';
    @observable codeError = false;
    @observable phoneError = false;
    @observable shakeTrigger = false;
    @observable showText = true;

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
    onChangeText = propName => value => {
        this[propName] = value;
        this[propName + 'Error'] = false;

    }

    @action
    onFocus = propName => () => {
        if (propName === 'code' && !this.code.includes('+')) {
            this.code = '+';            
        }
    }

    @action
    onBlur = propName => () => {
        const codeHasOneChar = () => {
            return propName === 'code' && this.code.length == 1;
        }

        if (codeHasOneChar()) {
            this[propName] = '';
        }
    }    

    submitPhoneAndEmail = () => {
        this.submittedPhone = this.phone;
        this.submittedEmail = this.email;
        this.submittedCode = this.code;
    }

    submittedDataDidChange = () => {
        if ( 
            this.submittedPhone !== this.phone
            || this.submittedEmail !== this.email
            || this.submittedCode !== this.code
        ) {
            this.loginStore.phoneVerified = false;
            return true;
        }

        return false;
    }

    saveUserInfo = () => {
        this.appStore.user.email = this.email;
        this.appStore.code = this.code;
        this.appStore.phone = this.phone;
    }

    postToRestorePass = (data) => {
        return axios.post(this.appStore.URL_RESTORE_PASS, data)
            .then(res => this.handleResponse(res))
            .catch(err => this.handleError(err));
    }

    handleResponse =(res) => {
        this.appStore.loading = false;
        if (res.data.success) {
            this.submitPhoneAndEmail();
            this.appStore.user.token = res.data.token;
            this.appStore.restorePassProcedure = true;
            this.navigation.levelTwo.moveTo('/smsconfirm');
        } else {
            this.appStore.errorText = 'No such user found'
        }
    }

    handleError = (err) => {
        console.log(err, 'error while sending data to reset pass');
        this.appStore.loading = false;
        this.appStore.errorText = 'Network error';
    }

    getPhoneAndEmail = () => {
        return {
            phon: this.code + this.phone + '',
            user: this.email
        }
    }

    onResetButtonPress = () => {
        if (this.submittedDataDidChange()) {
            if (!this.email) {
                this.onError('email');
            } else if (!this.code) {
                this.onError('code');
            } else if (!this.phone) {
                this.onError('phone');
            } else {
                this.appStore.loading = true;
                this.saveUserInfo();
                this.postToRestorePass(this.getPhoneAndEmail());
            }

        } else {
            if (this.loginStore.phoneVerified) {
                this.navigation.levelTwo.moveTo('/passchange');    
            } else {
                this.navigation.levelTwo.moveTo('/smsconfirm');
            }
        }
    }

    toggleTextVisibility = () => {
        this.showText = !this.showText;
    }

    onSubmitFocusNextInput = (input) => () => {
        let refsProps = Object.keys(this.refs);
        let inputIndex = refsProps.findIndex(prop => prop === input);
        let refsLength = refsProps.length;
        let nextRef = refsProps[++inputIndex]

        if (inputIndex == refsLength) {
            this.onResetButtonPress();
        } else {
            this.refs[nextRef].focus();
        }
    }

    onError = (propName) => {
        this[propName + 'Error'] = true;
        this.shakeTrigger = true;
        this.refs[propName].focus(); 
        Vibration.vibrate([300, 100]);
    }
}    