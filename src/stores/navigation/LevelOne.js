import { observable, computed, action } from 'mobx';

export class LevelOne{

    constructor(navigationStore){
        this.navigationStore = navigationStore;
    }

    history = {};
    moveBackCount = 1;



    backHandler = () => {
        const { pathname } = this.history.location;

        if(pathname == '/'){
            return false;
        }
        else {
            return this.handleBackNavigation();
        }
    }

    handleBackNavigation = () => {
        this.appStore.setInitialState();
        this.moveBack();
        return true;
    }

    moveBack = (n) => {
        if(n) {
            this.history.go(-n);
            this.history.entries.splice(-n, n)
        }
        else {
            this.history.goBack();
        }
    }

    moveTo = (path) => {
        this.history.push(path)
    }

    resetHistory = () => {
        this.history = [];
    }
    
}