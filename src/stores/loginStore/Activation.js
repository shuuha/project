import { observable, computed, action } from 'mobx';
import axios from 'axios';

export class Activation{
    @observable values = ['', '', '' , ''];    
    @observable errorValues = false;
    @observable wrongSmsCode = false;
    activeInputIndex;
    refs;
    Vibration;

    constructor(loginStore){
        this.loginStore = loginStore 
    }
    
    onInputChange = (refs, i, e, keyCode) => {
        const text = e.nativeEvent.text;
        const length = Object.keys(refs).length - 1;        
        if(i != length && text){
            refs['input' + ++i].focus();
        }        
    }

    onInputDeleteKeyPress = (keyCode) => {
        let i = this.activeInputIndex;
        if(keyCode == 67 && i > 0 && this.values[i].length == 0){
            this.refs['input' + --i].focus();
        }
    }


    @action
    onChangeText = (text, i) => {
        this.values[i] = text;
        this.errorValues = false;
        this.wrongSmsCode = false;
    }

    @action
    onSubmitEditing = () => {
        this.onEnter();          
    }

    @computed
    get inputsAreValid(){
        const NUMBERS = '0123456789';
        const codeInputsAreValid = this.values.every(q => {
            if(q !== ''){
                return NUMBERS.includes(q);
            }
            return false;
        }); 
        return codeInputsAreValid;
    }

    onError = () => {        
        let count = 0;
        this.values.forEach((q, i) => {
            if(q.length == 0 && count == 0){
                this.refs['input' + i].focus();
                count++;
            }
        })
        if(this.wrongSmsCode){
            this.errorValues = true;
            this.Vibration.vibrate([300, 100]);
            this.refs.input0.focus();
        }
    }

    @action
    onEnter = () => {
        // this.loginStore.showLogo = false;
        // this.loginStore.history.push('/register'); 
        if(this.inputsAreValid){
            this.loginStore.loading = true;
            const data = {
                token: this.loginStore.token,
                code: this.values.join('')
            }
            axios.post(this.loginStore.URL_NEWUSER, data)
                .then(res => {
                    if(res.data.success){
                        this.loginStore.token = res.data.token;
                        this.loginStore.showLogo = false;
                        this.loginStore.history.push('/register');
                    }
                    else {
                        this.wrongSmsCode = true;
                        this.onError();
                    }
                        this.loginStore.loading = false;
                })
                .catch( err => {
                    this.loginStore.errorText = 'Network error';
                    this.loginStore.loading = false;                    
                    console.log(err)
                });
        }
        else {
            this.onError();
        }
    }

    onSelectionChange = (e) => {
    }

    onFocus = (i) => {
        this.loginStore.errorText = null;
        this.activeInputIndex = i;
    }
}