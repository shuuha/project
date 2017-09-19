import { observable, computed, action } from 'mobx';

import PageStore from './PageStore';

export class AppStore{

    @observable pages = [];

    constructor(){
        this.loadData();
    }

    @action
    loadData(){
        const temp = require('../data/data.json');
        this.pages = Object.keys(temp).map(q => new PageStore(temp[q]));
    }
    
    BackHandler(history){        
        if(history.location.pathname !== '/') { 
            history.goBack();
            return true }
        return false;
    }

    goBack(history){        
        history.goBack();
    }

    goForward(history, nextPage){
        console.log('moving forward: ', nextPage);
        history.push(nextPage);
    }
}