import { observable, computed, action } from 'mobx';

// import InputFactory from '../factories/InputFactory';

export default class InputStore{        // a single instance of an input    
    @observable value = '';             // input's value
    @observable _isValid;               // input validation    
    
    id = Math.round(Math.random() * 1000);

    constructor(input, type, pageStore ){           //obj, numbers, store
        this.pageStore = pageStore;
        this.type = type;
        // this.value = input.value;
        

        this.initInput(input, type);

        this.initInputAsValid();      // set isValid to true when refetching data
    };

    initInputAsValid(){
        if(this.value)
            this.isValid = true;
    }

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
        const { label, 
                placeholder,
                format: { 
                    characters, 
                    numbers, 
                    maxlength, 
                    minlength, 
                    required 
                }} = input || {};

        this.label = label;
        this.placeholder = placeholder;
        this.maxLength = maxlength;
        this.minLength = minlength;
        this.required =  required;
        this.characters =  characters || '';
        this.numbers = numbers || '';
        this.value = input.value;

        this.checkValue = (text) =>{
            const symbols = (this.characters + ' '|| '') + (this.numbers || '');
            return text.split('').every(s => symbols.includes(s.toUpperCase()));
       }

       this.isDigitAndChar = (text) => {
           text = text.slice(0, 2).split('');
           const char = text.filter(q => this.characters.includes(q.toUpperCase())).length;
           const digit = text.filter(q => this.numbers.includes(q)).length;
           
           this.isValid = (char == 1 && digit == 1);
       }
    }

    typeQuestion = input => {
        this.label = input.label;
        this.value = input.value;
        this.required = input.required;

    this.swipeRightOrLeft = (side) => {                 // side - true or false
        this.value = side;              
        this.pageStore.goForward();
        }
    }

    // @action
    //  handleYesNoPress(e){
    //     this.isActive = e;
    //     this.isValid = true;
    // }


    @computed
    get isValid(){        
        if(!this.required)
            return true;

        return this._isValid;        
    }
    
    set isValid(value){
        this._isValid = value;
    }    

    @computed
    get inputValue(){
        return this.value;
    }

    @action
    handleYesNoPress(e){
        this.value = !!e;
        // this.pageStore.isActive = e;
        this.pageStore.goForward()
    }

    @action
    handleChange = (text) =>{
        if(this.checkValue(text))
            this.value = text;

        if(this.value.length <= (this.minLength || 2 ))
            this.isDigitAndChar(this.value);

        if(text.length == this.maxLength){
            console.log('handlechange');
                this.pageStore.goForwardWithDelay()}
    }

    onSubmitEditing(){                    
        this.pageStore.onSubmitEditing()
    }
}