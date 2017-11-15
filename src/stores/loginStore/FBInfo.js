import { observer, computed, action } from 'mobx';

export class FBInfo{

    constructor(loginStore){
        this.loginStore = loginStore;
    }
}