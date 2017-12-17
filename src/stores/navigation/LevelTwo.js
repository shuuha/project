import { observable, computed, action } from 'mobx';

export class LevelTwo {

    history = {};
    moveBackCount = 1;

    constructor(navigationStore) {
        this.navigationStore = navigationStore;
    }
    
    get appStore() {
        return this.navigationStore.appStore;
    }

    get pathname() {
        return this.history.location.pathname;
    }

    backHandler = () => {        
        if (this.pathname == '/') {
            this.appStore.setInitialState();
            this.appStore.setUserOffline();
            return false;
        } 

        return this.handleBackNavigation();
    }

    handleBackNavigation = () => {
        this.appStore.setInitialState();
        if (
            this.pathname == '/register'
            || this.pathname == '/passchange'
        ) {                
            this.appStore.showLogo = true;
            // this.moveBack(this.moveBackCount);
            // this.moveBackCount = 1;
        } else if ( 
            this.pathname === '/signup'
            || this.pathname === '/menu'
            || this.pathname ==='/restorepass'
        ) { 
            this.moveBack();
            this.navigationStore.showBackButton = false;
        } else if (this.pathname == '/passchangedone') {
            this.navigationStore.showBackButton = false;
            this.navigationStore.levelOne.moveTo('/');
        } 

        this.moveBack();
        return true;
    }

    moveBack = (n) => {
        if (n) {
            this.history.go(-n);
            // this.history.entries.splice(-n, n)
        } else {
            this.history.goBack();
        }
    }

    moveTo = (path, prop ='push') => {
        if (
            path === '/menu' 
            || path === '/passchangedone'
        ) {
            this.navigationStore.showBackButton = false;
        } else { 
            this.navigationStore.showBackButton = true;
        }

        this.history[prop](path);
    }

    replace = (path) => {
        this.moveTo(path, 'replace');
    }

    resetHistory = () => {
        this.history.entries = [];
    }
}
