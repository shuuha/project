import { observable, computed, action } from 'mobx';
import { Vibration } from 'react-native';

export class ServiceMenu{
    @observable currentTime = '13:00';
    @observable timeToComplete = '4 Hours';
    @observable price = '$10';
    @observable balance = '$200';
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

    onSlideSuccess = () => {
        console.log('onslide success');
        Vibration.vibrate([300, 100]);
    }

}