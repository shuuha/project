import { observable, computed, action } from 'mobx';

export class Activation{
    @observable values = ['', '', '' , ''];
    activeInputIndex;

    constructor(loginStore){
        this.loginStore = loginStore 
    }
    
    onInputChange = (refs, i, e, keyCode) => {
        let j = i;
        const text = e.nativeEvent.text;
        const length = Object.keys(refs).length - 1;        
        if(i != length && text){
            refs['input' + ++i].focus();
        }        
    }

    onInputDeleteKeyPress = (keyCode, refs) => {
        let i = this.activeInputIndex;
        if(keyCode == 67 && i > 0 && this.values[i].length == 0){
            refs['input' + --i].focus();
        }
    }

    @action
    onChangeText = (text, i) => {
        this.values[i] = text;
    }

    @action
    onEnter = () => {
        this.loginStore.showLogo = false;
        this.loginStore.history.push('/register');
    }

    onSelectionChange = (e) => {
    }

    onFocus = (i) => {
        this.activeInputIndex = i;
    }
}