import { observable, computed, action } from 'mobx';
import { Vibration } from 'react-native';

export class Menu{
    @observable currentTime = '13:00';
    @observable timeToComplete = '4 Hours';
    @observable _seconds = 10;
    @observable balance = '$200';
    @observable _companyName ='Yay Intelligence as';
    @observable companyAddress = 'Markvein  35A, 0554 Oslo';

    constructor(serviceStore){
        this.serviceStore = serviceStore;
    }

    @computed
    get companyName(){
        return this._companyName.toUpperCase();
    }

    @computed
    get seconds(){
        return this._seconds + ' S';
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