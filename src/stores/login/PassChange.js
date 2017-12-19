import { observable, computed, action } from 'mobx';
import axios from 'axios';
import { Vibration } from 'react-native';

export class PassChange {

    text = 'Enter new password';
    refs = {};

    @observable pass = '';
    @observable passConfirm = '';
    @observable passError = false;
    @observable passConfirmError = false;
    @observable shakeTrigger = false;

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

    handleError = (err) => {
        this.appStore.loading = false;
        console.log(err, 'error while making a post to change the password');
    }

    handleResponse = (res) => {
        if (res.data.success) {
            this.navigation.levelTwo.moveTo('/passchangedone');
        } else {
            this.appStore.errorText = 'No such user found'
        }

        this.appStore.loading = false;
    }

    postData = (url, data) => {
        return axios.post(url, data)
            .then( res => this.handleResponse(res))
            .catch( err => this.handleError(err));
    }

    dataToSend = () => {
        return {
            token: this.appStore.user.token,
            pass: this.pass
        }
    }

    onChangePassPress = () => {
        if (!this.pass) {
            this.onError('pass');
        } else if (
            !this.passConfirm
            || this.pass !== this.passConfirm
        ) {
            this.onError('passConfirm');
        } else {
            this.appStore.loading = true;
            this.appStore.user.pass = this.pass;
            this.postData(this.appStore.URL_RESTORE_PASS, this.dataToSend());
        }
    }

    onError = (propName) => {
        this[propName + 'Error'] = true;
        this.shakeTrigger = true;
        this.refs[propName].focus();
        Vibration.vibrate([300, 100]);
    }

    onSubmitFocusNextInput = (input) => () => {
        let refsProps = Object.keys(this.refs);
        let inputIndex = refsProps.findIndex(prop => prop === input);
        let refsLength = refsProps.length;
        let nextRef = refsProps[++inputIndex];

        if (inputIndex == refsLength) {
            this.onChangePassPress();
        } else {
            this.refs[nextRef].focus();
        }
    }

    onGoToLogin = () => {
        this.navigation.showBackButton = true;
        this.navigation.levelTwo.resetHistory();
        this.navigation.levelTwo.moveTo('/');
    }
}