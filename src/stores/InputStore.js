import { observable, computed, action } from 'mobx';

import InputFactory from '../factories/InputFactory';

export default class InputStore{        // a single instance of an input    
    @observable value = '';
    @observable _isValid = false;
    @observable text;
    
    id = Math.round(Math.random() * 1000);
    
    formatPredicates = [];

    constructor(input, type){           //obj, number
        this.initInput(input, type);
    };

    initInput(input, type){
        switch(type){
            case 1: 
            this.typeInput(input);
            break;

            case 2:
            this.typeQuestion(input);
            break;           
        }
    }

    typeInput(input){
        this.label = input.label;
        this.placeholder = input.placeholder;        
        this.required = input.format.required;        
        this.data = input.format;

        
        this.initPredicates();        
    }

    typeQuestion(input){
        this.label = input.label;        
    }

    initPredicates(){        
            Object.keys(this.data).forEach( key => {
                const fn = InputFactory.makePredicate(key, this.data[key]);
                if(fn) this.formatPredicates.push(fn);
        });
    }

    @action
    handleChange(text){
        this.value = text;        
        
        if(this.required) {
            this._isValid = this.formatPredicates.every( fn => fn(this.value));
            if(this._isValid){
                return;
            }

            else if(!this._isValid && this.value.length !=0){
                this.value = this.value.slice(0, -1);
                this._isValid = true;                
            }

            else {
                this.value = this.value.slice(0, -1);
                this._isValid = false;                
            }
        }

        else this._isValid = true;     
    }

    @computed
    get isValid(){        
        return this._isValid;

    }
}

