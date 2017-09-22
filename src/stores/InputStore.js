import { observable, computed, action } from 'mobx';

import InputFactory from '../factories/InputFactory';

export default class InputStore{        // a single instance of an input    
    @observable value = '';             // input's value
    @observable _isValid;               // input validation
    @observable isActive;               // 0 - no, 1 - yes, 2 - not sure (question buttons)        
    
    id = Math.round(Math.random() * 1000);

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
        const { label, placeholder,
                format: { characters, numbers, maxlength, minlength, required } } = input || {};

        this.label = label;
        this.placeholder = placeholder;
        this.maxLength = maxlength;
        this.minLength = minlength;
        this.required =  required;
        this.characters =  characters || '';
        this.numbers = numbers || '';       

       this.checkValue = (text) =>{
            const symbols = (this.characters + ' '|| '') + (this.numbers || '');
            return text.split('').every(s => symbols.includes(s.toUpperCase()));
       }

       this.checkFirstTwo = (text) => {
           const inText = text.slice(0, 2).split('');
           let areStrings = inText.every(t => this.characters.includes(t.toUpperCase()));
           let areNumbers = inText.every(t => this.numbers.includes(t));
           let isSpace = inText.some(t => t === ' ');
        

           // if all return false, then the text equals to str + num, or num + str
           this.isValid = !(areStrings + areNumbers + isSpace);           
       }       
    }


    typeQuestion(input){
        this.text = input.text;
        this.required = input.required;

    }    

    @action
     handleYesNoPress(e){
        this.isActive = e;
        this.isValid = true;
    }


    @computed
    get isValid(){        
        if(!this.required)
            return true;

        return this._isValid;        
    }
    
    set isValid(value){
        this._isValid = value;
    }    

    @action
    handleChange(text){
        this.checkValue(text) && (this.value = text);
        if(this.value.length <= (this.minLength || 2 ))
            this.checkFirstTwo(this.value);
    }
}

