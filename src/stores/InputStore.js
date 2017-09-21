import { observable, computed, action } from 'mobx';

import InputFactory from '../factories/InputFactory';

export default class InputStore{        // a single instance of an input    
    @observable value = '';             // input's value
    @observable _isValid;               // input validation
    @observable isActive;               // 0 - no, 1 - yes, 2 - not sure (question buttons)    
    
    
    id = Math.round(Math.random() * 1000);
    
    // formatPredicates = [];

    constructor(input, type){           //obj, number
        this.type = type;

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
        this.formatPredicates = [];
        
        this.initPredicates();        
    }

    typeQuestion(input){
        this.text = input.text;        
    }

    initPredicates(){
            Object.keys(this.data).forEach( key => {
                const fn = InputFactory.makePredicate(key, this.data[key]);
                if(fn) this.formatPredicates.push(fn);
        });
    }

     handleYesNoPress(e){        
        this.isActive = e;
        this.isValid = true;
    }

    @computed
    get isValid(){
        if(this.type === 1 && this.required) {
            return this._isValid }

        else if(this.type === 2) {            
            return this._isValid }
        
        else return true;
    }
    
    set isValid(value){
        this._isValid = value;
    }

    @action
    handleChange(text){
        this.value = text;        
        
        if(this.required) {
            this.isValid = this.formatPredicates.every( fn => fn(this.value));
            if(this.isValid){
                return;
            }

            else if(!this.isValid && this.value.length !=0){
                this.value = this.value.slice(0, -1);
                this._isValid = true;                
            }

            else {
                this.value = this.value.slice(0, -1);
                this.isValid = false;                
            }
        }

        else this.isValid = true;
    }
}

