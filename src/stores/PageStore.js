import { observable, computed, action } from 'mobx';

import InputStore from './InputStore';

export default class PageStore{
    
    _headerTitle;
    _buttonLabel;
    _page;
    _nextPage;
    
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

    @computed
    get inputsValues(){
        let values = [];
            values = this.inputs.map(q => ({label: q.label, value: q.value}) );            
            return values;            
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
    
   get collectPageData(){                                    // important, need to preserve this format to 
        const data = {                                       // maintain correct link with the server
           id: this.appStore.id,                             // -> number
           page: this._page,                                 // -> number
           inputs: this.inputsValues                         // -> arr of objs    [{label: value}, {label: value} ]
       }
    //    console.log(data);
        return data;
    }

    goForwardWithDelay(){         
         if(this.inputsAreValid)
            setTimeout(()=>{ this.goForward() }, 2000);
    }
    
    onSubmitEditing(){
        if(this.inputsAreValid)
            this.goForward();
    }    

    goForward(){                       // from appStore
        this.appStore.postData(this.collectPageData);            
    }
}

// {header, inputs:[{format: { chars, number, require}}],  nextLabel }