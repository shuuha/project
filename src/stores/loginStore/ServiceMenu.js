import { observable, computed, action } from 'mobx';

export class ServiceMenu{
    @observable currentTime = '13:00';
    @observable timeToComplete = '4 Hours';
    @observable price = '$200';
    @observable _companyName ='Yay Intelligence as';
    @observable companyAddress = 'Markvein  35A, 0554 Oslo';

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @computed
    get companyName(){
        return this._companyName.toUpperCase();
    }

    onPhotoshopPress = () => {

    }
    
    onHtmlPress = () => {

    }
    
    onWebDesignPress = () => {

    }
}