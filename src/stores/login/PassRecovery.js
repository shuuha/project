import { observable, computed, action } from 'mobx';
import axios from 'axios';
import { Vibration } from 'react-native';

export class PassRecovery {

    refs = {};

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

    saveUserInfo = () => {
        this.appStore.user.email = this.email;
        this.appStore.code = this.code;
        this.appStore.phone = this.phone;
    }

    postToRoutePassrecovery = (data) => {
        return axios.post(this.appStore.URL_PASSRECOVERY, data)
            .then(res => this.handleResponse(res))
            .catch(err => this.handleError(err));
    }

    handleResponse =(res) => {
        this.appStore.loading = false;

        if (res.data.success) {
            this.navigation.levelTwo.moveTo('/activation'); 
        } else {
            this.appStore.errorText = 'No such user found'
        }
    }

    handleErorr = (err) => {
        console.log(err, 'error while sending data to reset pass');
    }

    getPhoneAndEmail = () => {
        return {
            phon: this.code + this.phone + '',
            user: this.email
        }
    }

    onResetButtondPress = () => {
        if (!this.email) {
            this.onError('email');
        } else if (!this.code) {
            this.onError('code');
        } else if (!this.phone) {
            this.onError('phone');
        } else {
            this.appStore.loading = true;
            this.saveUserInfo();
            this.postToRoutePassrecovery(this.getPhoneAndEmail());
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
            this.onSendPress();
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