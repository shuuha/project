import { observable, computed, action } from 'mobx';

export default class InputFactory{ 

    static chars = '';    

    static makePredicate(key, value){
        switch(key){
           case 'characters':           
            this.chars = value;                    
                break;

            case 'numbers':                
                return text => { 
                    this.chars += value;                    
                    const temp = text.toUpperCase().split('').every(q => this.chars.includes(q));
                        // console.log('chars', temp);
                        return temp };
                    

            // case 'minlength':
            //     return text => {                    
            //             const  temp =  text.length >= value;
            //             // console.log('min: ', temp);
            //             return temp };                                

            case 'maxlength':
                return text => {
                        const temp =  text.length !=0 && text.length <= value;
                        // console.log('max: ', temp);
                        return temp };                    
            }        
    }
}
