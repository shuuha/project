import { observable, computed, action } from 'mobx';
import { 
    SmsConfirm, 
    Main, 
    RestorePass, 
    Register,
    SignUp,
    PassChange
} from '../login';

export class Login {
    
    phoneVerified = false;

    constructor(appStore) {
        this.appStore = appStore;
    };

    smsConfirm = new SmsConfirm(this);
    main = new Main(this);
    restorePass = new RestorePass(this);
    signUp = new SignUp(this);
    register = new Register(this);
    passChange = new PassChange(this);
}