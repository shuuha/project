import { observable, computed, action } from 'mobx';
import { Photos } from './register';

export class Register{

    @observable userName = 'Smith Johnson';
    @observable email = '';
    @observable pass = '';
    @observable passConfirm = '';
    @observable avatarImageUri;
    
    photos = new Photos(this);

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

    onSubmitEmail = (nextInput) => {
        nextInput.focus();
    }

    onSubmitPass = (nextInput) => {
        nextInput.focus();
    }

    onSubmitPassConfirm = () => {
        this.onRegisterPress();
    }

    onAvatarPress = () => {
        this.loginStore.history.push('/photos')
    }
}