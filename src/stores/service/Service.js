import { observable, computed, action } from 'mobx';

import { Menu, LoggedIn, Geolocation } from '../service';

export class Service {

    constructor(appStore) {
        this.appStore = appStore;
    }

    menu = new Menu(this);
    loggedIn = new LoggedIn(this);
    geolocation = new Geolocation(this);
}