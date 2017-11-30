import { observable, computed, action } from 'mobx';
import { 
    Activation, 
    Main, 
    PassRecovery, 
    Register, 
    SignUp
    } from './login';

export class Login{
    
    constructor(appStore){
        this.appStore = appStore;
    };

    activation = new Activation(this);
    main = new Main(this);
    passRecovery = new PassRecovery(this);
    signUp = new SignUp(this);
    register = new Register(this);
    
    moveBackCount = 1;

    moveBack(n){
        if(n) {
            this.history.go(-n);
            this.history.entries.splice(-n, n)
        }
        else {
            this.history.goBack();
        }
    }

    backHandler(){
        const { pathname } = this.history.location;

        if(this.removeMode){
            this.removeMode = false;
            return true;
        }
        else if(pathname == '/' || pathname == '/loggedin'){
            return false;
        }
        else {
            return this.handleBackNavigation();
        }        
    }

    @action
    setInitialState(){
        this.appStore.errorText = null;
        this.appStore.loading = false;
    }

    handleBackNavigation(){
        this.setInitialState();
        const { pathname } = this.history.location;
        if(pathname == '/register'){
            this.appStore.showLogo = true;
            this.moveBack(this.moveBackCount);
        }        
        else {
            this.moveBack();
        }        
        return true;
    }
}