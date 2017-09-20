import { observable, computed, action } from 'mobx';

import InputStore from './InputStore';

export default class PageStore{
    
    _headerTitle;
    _buttonLabel;
    _page;
    _nextPage;

    constructor({ page, nextPage, header, type, inputs, nextLabel: button }){
        this._headerTitle = header;
        this._buttonLabel = button;
        this._page = page;
        this._nextPage = nextPage;

        this.inputs = Object.keys(inputs).map(q => new InputStore(inputs[q], type));    // array of inputs        
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

    get page(){
        let retVal = '/';
        if(this._page > 0)
            retVal = `/${this._page}`;
        return retVal;
    }

    get nextPage(){     
        return `/${this._nextPage}`;         
    }
}

// {header, inputs:[{format: { chars, number, require}}],  nextLabel }