import { observable, computed, action } from 'mobx';
import axios from 'axios';

export class SmsConfirm {
    @observable values = ['', '', '' , ''];    
    @observable errorValues = false;
    @observable wrongSmsCode = false;
    @observable canResend = true;
    @observable swingTrigger = false;
    @observable shakeTrigger = false;

    RESEND_CODE_DELAY = 10000;
    activeInputIndex;
    refs;
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
    
    get signUp() {
        return this.loginStore.signUp;
    }

    get restorePass() {
        return this.loginStore.restorePass;
    }

    onInputChange = (refs, i, e, keyCode) => {
        const text = e.nativeEvent.text;
        const length = Object.keys(refs).length - 1;
        const inputIsNotLastAndHasText = ( i != length && text );

        if (inputIsNotLastAndHasText) {
            refs['input' + ++i].focus();
        }
    }

    onInputDeleteKeyPress = (keyCode) => {
        let i = this.activeInputIndex;

        if (keyCode == 67 && i > 0 && this.values[i].length == 0) { 
            this.refs['input' + --i].focus();
        }
    }

    @action
    onChangeText = (text, i) => {
        this.values[i] = text;
        this.errorValues = false;
        this.wrongSmsCode = false;
    }

    onFocus = (i) => {
        this.appStore.errorText = null;
        this.resendMessage = '';

        if (i) {
            this.activeInputIndex = i;
        }
    }

    @action
    onSubmitEditing = () => {
        this.onEnter();
    }

    @action
    resetValues = () => {
        const valuesNew = this.values.map(value => value = '');
        this.values = [ ...valuesNew ];
    }

    @computed
    get inputsAreValid() {
        const NUMBERS = '0123456789';
        const codeInputsAreValid = this.values.every(q => {
            if (q !== '') {
                return NUMBERS.includes(q);
            }

            return false;
        });

        return codeInputsAreValid;
    }

    onError = () => {
        let count = 0;
        this.shakeTrigger = true;       
        this.values.forEach((q, i) => {
            if (q.length == 0 && count == 0) {
                this.refs['input' + i].focus();
                count++;
            }
        })

        if (this.wrongSmsCode) {
            this.errorValues = true;
            this.Vibration.vibrate([300, 100]);
            Object.keys(this.refs).forEach((prop, i) => (
                i == 0 ? this.refs[prop].focus() : null));
        }
    }

    handleSuccessResponse = (res) => {
        if (this.appStore.restorePassProcedure) {
            this.navigation.levelTwo.replace('/passchange');
        } else if (this.appStore.signUpProcedure) {
            this.navigation.levelTwo.replace('/register');
        }

        this.loginStore.phoneVerified = true;
        // this.navigation.levelTwo.moveBackCount = 2;
        this.appStore.user.token = res.data.token;
        this.appStore.restorePassProcedure = false;
        this.appStore.signUpProcedure = false;
        this.resetValues();
    }

    handleFailResponse = (res) => {
        this.appStore.errorText = res.data.message;
        this.wrongSmsCode = true;
        this.onError();
    }

    sendData = (url, data) => {
        axios.post(url, data)
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    this.handleSuccessResponse(res);
                } else {
                    this.handleFailResponse(res)
                }

                    this.appStore.loading = false;
            })
            .catch( err => {
                this.appStore.errorText = 'Network error';
                this.appStore.loading = false;                    
                console.log( 'sendSmsCode function error', err)
            });
    }

    getCodeAndToken = () => {
        return {
            token: this.appStore.user.token,
            code: this.values.join('')
        }
    }

    getUrl = () => {
        if (this.appStore.restorePassProcedure) {
            return this.appStore.URL_RESTORE_PASS;
        } 
        
        if (this.appStore.signUpProcedure) {
            return this.appStore.URL_NEWUSER;
        }
    }
         
    @action
    onEnter = () => {
        if (this.inputsAreValid) {
            this.appStore.loading = true;    
            this.sendData(this.getUrl(), this.getCodeAndToken());
        } else {
            this.onError();
        }
    }

    enableResendCode = () => {
        setTimeout(()=> {
            this.canResend = true;
        }, this.RESEND_CODE_DELAY);
    }

    getUserInfo = () => {
        if (this.appStore.restorePassProcedure) {
            return this.restorePass.getPhoneAndEmail();
        }
        
        if (this.appStore.signUpProcedure) {
            return this.signUp.getPhoneAndName();
        }
    }

    resendData = () => {
         return axios.post(this.getUrl(), this.getUserInfo())
            .then(res => {
                if (res.data.success) {
                    this.swingTrigger = true;
                    this.appStore.user.token = res.data.token;
                    this.resendMessage = 'Your code should arrive soon.'; 
                } else {
                    this.appStore.errorText = res.data.message;
                }
                
                this.appStore.loading = false;
                this.enableResendCode();
            })
            .catch(err => {
                this.enableResendCode();
                console.log('resend code function error', err);
            });
    }

    unFocusInputs = () => {
        const refsPropsToArray = Object.keys(this.refs);
        refsPropsToArray.map(prop => this.refs[prop].blur());
    }

    @action
    resendCode = () => {
        if (this.canResend) {
            this.resetValues();
            this.unFocusInputs();
            this.appStore.loading = true;
            this.appStore.errorText = null;
            this.canResend = false;
            setTimeout(this.resendData, 5000);
        }
    }
}
