import { observable, computed, action } from 'mobx';
import { Vibration } from 'react-native';

export class Menu {
    
    @observable timeStart = '13:00';
    @observable timeLength = '4 Hours';
    @observable _seconds = 10;
    @observable price = '$200';
    @observable _name ='Yay Intelligence as';
    @observable address = 'Markvein  35A, 0554 Oslo';

    constructor(serviceStore) {
        this.serviceStore = serviceStore;
    }

    get appStore() {
        return this.serviceStore.appStore;
    }

    get token() {
        return this.token = this.appStore.token;
    }

    @computed
    get companyName() {
        return this._name.toUpperCase();
    }

    set companyName(value) {
        this._name = value;
    }

    @computed
    get seconds() {
        return this._seconds + ' S';
    }    

    onPhotoshopPress = () => {
        return this.token.removeFromStorage()
            .then( res => {
                console.log('token deleted: ', res);
            })
            .catch(err => console.log(err));
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