import { observable, computed, action } from 'mobx';

import { Menu } from './serviceStore';


class ServiceStore{

    
    menu = new Menu(this);

}

export const serviceStore = new ServiceStore();