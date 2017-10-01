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

    @computed
    get inputsValues(){
        const valuesObj = {};
            this.inputs.forEach(q =>valuesObj[q.label] = q.inputValue );
        return valuesObj;
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
    
   get collectPageData(){
       let questionLabel;
            this.inputs.forEach(q => questionLabel = q.text );

       const data = {
           id: this.appStore.id,
           [questionLabel]: !!this.isActive,
           page: this._page,
           ...this.inputsValues
       }
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

    postData(){        
       this.appStore.postData(this.collectPageData);
    }

    goForward(){                       // from appStore
        this.appStore.goForward();
        this.postData();
    }
   
    swipeRightOrLeft(side){
        this.isActive = side;                           // isActive - 1 or 0        
        this.goForward();    
   }
}

// {header, inputs:[{format: { chars, number, require}}],  nextLabel }