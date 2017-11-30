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
            return false;
        } else {
            return this.handleBackNavigation();
        }
    }

    handleBackNavigation = () => {
        this.appStore.setInitialState();

        if (this.pathname == '/register') {
            this.appStore.showLogo = true;
            this.moveBack(this.moveBackCount);
        } else if ( this.pathname === '/signup' 
            || this.pathname === '/menu'
            || this.pathname ==='/passrecovery' ) {
                this.moveBack();
                this.navigationStore.showBackButton = false;
        } else {
            this.moveBack();
        }

        return true;
    }

    moveBack = (n) => {
        if (n) {
            this.history.go(-n);
            this.history.entries.splice(-n, n)
        } else {
            this.history.goBack();
        }
    }

    moveTo = (path) => {
        if (path === '/menu') {
            this.navigationStore.showBackButton = false;
        } else { 
            this.navigationStore.showBackButton = true;
        }

        this.history.push(path)
    }

    resetHistory = () => {
        this.history = [];
    }
}