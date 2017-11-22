import { observable, computed, action } from 'mobx';
import { 
    Activation, 
    LoginView, 
    PassRecovery, 
    Register, 
    SignUp,
    FBInfo,
    ServiceMenu
    } from './loginStore';

class LoginStore{
    activation = new Activation(this);
    loginView = new LoginView(this);
    passRecovery = new PassRecovery(this);
    signUp = new SignUp(this);
    register = new Register(this);
    fbInfo = new FBInfo(this);
    serviceMenu = new ServiceMenu(this);

    URL_NEWUSER = 'http://app.yayintel.com:8883/api/newuser';
    URL_AUTH = 'http://app.yayintel.com:8883/api/authenticate';
    URL_ONLINE = 'http://app.yayintel.com:8883/api/online';
    URL_FB = 'http://app.yayintel.com:8883/api/authenticate/facebook'; 

    
    @observable showLogo = true;
    @observable loading = false; 
    @observable errorText = null;
    @observable showBackButton = true;
    @observable loggedIn = false;

    showLogoAnimation = true;
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
        this.errorText = null;
        this.loading = false;
    }

    handleBackNavigation(){
        this.setInitialState();        
        const { pathname } = this.history.location;
        if(pathname == '/register'){
            this.showLogo = true;            
            this.moveBack(this.moveBackCount);
        }        
        else {
            this.moveBack();
        }        
        return true;
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