import { observable, computed, action } from 'mobx';

import InputStore from './InputStore';

export default class PageStore{
    
    _headerTitle;
    _buttonLabel;
    _page;
    _nextPage;

    @observable isActive;    

    constructor({ page, nextPage, header, type, inputs, nextLabel: button }, appStore){
        this.appStore = appStore;
        this._headerTitle = header;
        this._buttonLabel = button;
        this._page = page;
        this._nextPage = nextPage;
        this.type = type;

        this.inputs = Object.keys(inputs).map(q => new InputStore(inputs[q], type, this));    // array of inputs        
    }

    get headerTitle(){
        return this._headerTitle.slice(0, 1).toUpperCase() + this._headerTitle.slice(1).toLowerCase();
    }

    get buttonLabel(){
        return this._buttonLabel.slice(0, 1).toUpperCase() + this._buttonLabel.slice(1).toLowerCase();
    }

    get navButtonEnabled(){        
        return this._page !== 0;
    }

    @computed
    get inputsAreValid(){        
        return this.inputs.every(i => i.isValid);
    }

    get currentPage(){
        return this._page;
    }

    get page(){
        let retVal = '/';
        if(this._page > 0)
            retVal = `/${this._page}`;
        return retVal;
    }

    get nextPage(){     
        return `/${this._nextPage}`;
   }
    
    goForward(history, nextPage){                       // from appStore
        this.appStore.goForward(history, nextPage);
    }
   
    swipeRightOrLeft(history, nextPage, side){        
        this.isActive = side;                           // isActive - 1 or 0        
        this.goForward(history, nextPage);    
   }
}

// {header, inputs:[{format: { chars, number, require}}],  nextLabel }