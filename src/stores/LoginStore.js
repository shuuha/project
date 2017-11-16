import { observable, computed, action } from 'mobx';
import { 
    Activation, 
    LoginView, 
    PassRecovery, 
    Register, 
    SignUp,
    FBInfo
    } from './loginStore';

class LoginStore{
    activation = new Activation(this);
    loginView = new LoginView(this);
    passRecovery = new PassRecovery(this);
    signUp = new SignUp(this);
    register = new Register(this);
    fbInfo = new FBInfo(this);    

    URL_NEWUSER = 'http://app.yayintel.com:8883/api/newuser';
    URL_AUTH = 'http://app.yayintel.com:8883/api/authenticate';
    URL_ONLINE = 'http://app.yayintel.com:8883/api/online';
    URL_FB = 'http://app.yayintel.com:8883/api/authenticate/facebook'; 

    
    @observable showLogo = true;
    @observable loading = false; 
    @observable errorText = null;
    @observable showBackButton = true;

    showLogoAnimation = true;
    movedBackAfterVerification = false;

    moveBack(n){        
        if(n) {
            this.history.go(-n);
            this.history.entries.splice(-n, n)
        }
        else {
            this.history.goBack();
        }
        // this.currentPage--;        
    }

    backHandler(){
        const { pathname } = this.history.location;

        if(this.removeMode){
            this.removeMode = false;
            return true;
        }
        else if(!this.showBackButton){
            return false;
        }
        else if(pathname == '/register'){            
            this.showLogo = true;
            this.loading = false;            
            this.moveBack(2);
            this.movedBackAfterVerification = true;
            return true;
        }        
        else if(pathname == '/loggedin'){
            this.showLogo = false;
            this.moveBack();
            return true;
        }        
        else if(pathname != '/'){
            this.moveBack();
            return true;
        }
        return false;
    }

    @action
    setInitialState(){
        this.errorText = null;
        this.loading = false;
    }

    goBack(){
        this.setInitialState();
        const { pathname } = this.history.location;
        if(pathname == '/register'){
            this.showLogo = true;            
            this.moveBack(2);
            this.movedBackAfterVerification = true;
        }
        else if(pathname == '/loggedin'){
            this.showLogo = false;
            this.moveBack();            
        }
        else if(this.history.location.pathname != '/'){
            this.moveBack()
        }
    }

    goForward(){
        if(this.pages.length - 1 >= this.currentPage){
            const pathname  = this.history.location.pathname.slice(0, 1);
            const path = pathname + this.currentPage++;
            this.history.push(path);            
        }
    }    
}

const loginStore = new LoginStore();
export { loginStore };