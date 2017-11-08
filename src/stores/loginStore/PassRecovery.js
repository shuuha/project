import { observable, computed, action } from 'mobx';

export class PassRecovery{
    @observable value = '';

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    onChangeText = (p) => {
        this.value = p;
    }

    onSendPress = () => {

    }

    onSubmitEditing = () => {
        this.onSendPress();
    }
}
    