import { observable, computed, action } from 'mobx';
import { 
    Activation, 
    Main, 
    PassRecovery, 
    Register,
    SignUp
} from '../login';

export class Login{
    
    constructor(appStore) {
        this.appStore = appStore;
    };

    activation = new Activation(this);
    main = new Main(this);
    passRecovery = new PassRecovery(this);
    signUp = new SignUp(this);
    register = new Register(this);    
}