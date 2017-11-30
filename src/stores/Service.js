import { observable, computed, action } from 'mobx';

import { Menu, LoggedIn } from './service';


export class Service{

    constructor(appStore){
        this.appStore = appStore;
    }

    menu = new Menu(this);
    loggedIn = new LoggedIn(this);
}