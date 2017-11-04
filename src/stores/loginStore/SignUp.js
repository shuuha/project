import { observable, computed, action } from 'mobx';

export class SignUp{

    @observable fullname;
    @observable codeValue = '';
    @observable phoneValue;

    constructor(loginStore){
        this.loginStore = loginStore; 
    }

    @action
    onChangeName = (e) => {
        this.fullname = e;
    }

    @action
    onChangeCode = (e) => {
        this.codeValue = e;
        if(this.codeValue.length == 0){
            this.codeValue = '+';
        }
    }

    @action
    onChangePhone = (e) => {
        this.phoneValue = e;
    }

    @action
    onBlur = () => {
        if(this.codeValue.length == 1){
            this.codeValue = '';
        }
    }

    @action
    onFocus = () => {
        if(this.codeValue.length == 0){
            this.codeValue = '+'
        }
    }    

    onSendPress = () => {
        this.loginStore.history.push('/activation');
    }

    onNameSubmitPress = (refs) => {
        console.log('submit on name', refs);
        refs.inputCode.focus();
    }

    onCodeSubmitPress = (refs) => {
        refs.inputPhone.focus();
    }

    onPhoneSubmitPress = (refs) => {
        this.onSendPress();
    }
}