import { observable, computed, action } from 'mobx';

import PageStore from './PageStore';

export class AppStore{

    @observable pages = [];

    constructor(){
        this.loadData();
    }

    @action
    loadData(){
        let temp = require('../data/data.json');        
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
        if(this.pages.length > nextPage.slice(-1)){            
            history.push(nextPage)}
    }
}