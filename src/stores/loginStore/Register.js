import { observable, computed, action } from 'mobx';

export class Register{

    @observable userName = 'Smith Johnson';
    @observable email = '';
    @observable pass = '';
    @observable passConfirm = '';
    
    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    onChangeEmail = (e) => {
        this.email = e;
    }

    @action
    onChangePass = (e) => {
        this.pass = e;
    }

    @action
    onChangePassConfirm = (e) => {
        this.passConfirm = e;
    }

    onRegisterPress = () => {
        if(this.pass === this.passConfirm){
            console.log('registration is complete');
        }
    }

    onTosPress = () => {
        console.log('loading tos page');
    }
}