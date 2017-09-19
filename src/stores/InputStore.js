import { observable, computed, action } from 'mobx';

import InputFactory from '../factories/InputFactory';

export default class InputStore{        // a single instance of an input    
    @observable value = '';    
    id = Math.round(Math.random() * 1000);
    
    formatPredicates = [];

    constructor(input, type){           //obj, number
        this.initInputs(input, type);
    };

    initInputs(input, type){
        switch(type){
            case 1: 
            this.typeInputText(input);
            break;

            case 2:
            this.typeInputQuestion(input);
            break;           
        }
    }

    typeInputText(input){
        this.label = input.label;
        this.placeholder = input.placeholder;
        this.value = input.value;
        this.required = input.format.required;
        this.data = input.format;
        
        this.initPredicates();        
    }

    typeInputQuestion(input){
        this.label = input.label;
        this.value = input.value;
        this.question = input.question;
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
        this.isValid;      
    }

    @computed
    get isValid(){
        // return this.formatPredicates.every(fn => fn(this.value));

        if(this.required) 
             return this.formatPredicates.every( el => el(this.value));
        
        return true;
    }
}

