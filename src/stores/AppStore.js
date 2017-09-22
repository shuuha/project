import { observable, computed, action } from 'mobx';

import PageStore from './PageStore';

export class AppStore{

    @observable pages = [];

    @observable _lastPage = 0;
    

    constructor(){
        this.loadData();
    }

    @action
    loadData(){
        let temp = require('../data/data.json');        
        this.pages = Object.keys(temp).map(q => new PageStore(temp[q]));
    }
    
    @computed
    get lastPage(){
        return this.pages.length > this._lastPage;
    }

    set lastPage(value){
        this._lastPage = value;
    }

    BackHandler(history){        
        if(history.location.pathname !== '/') { 
            this.goBack(history);            
            return true }
        return false;
    }

    goBack(history){        
        history.goBack();
        this.lastPage -= 1;
    }

    goForward(history, nextPage){
        this.lastPage = nextPage.slice(-1)        
        if(this.lastPage){
            history.push(nextPage)
        }

        
    }
}