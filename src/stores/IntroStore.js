import { observable, computed, action } from 'mobx';

class IntroStore{    
    @observable phoneNo;
    @observable smsCode;
    @observable userInfo = {};
    @observable showSmsInput = false;
    @observable driverLicense = '';
    moveToNext = false;
    

    @action
    onChangePhoneText = (value) => {
        this.phoneNo = value;
    }

    @action
    onChangeSmsText = (value) => {
        this.smsCode = value;        
    }

    @action
    onSubmitEditingPhone = (introPage) => {        
        this.moveToNext = true;
        this.showSmsInput = true;
        introPage.forceUpdate();
    }

    @action
    onSubmitEditingSms = () => {

    }

}

export const introStore = new IntroStore();