import { observable, computed, action } from 'mobx';
import { 
    Activation, 
    LoginView, 
    PassRecovery, 
    Register, 
    SignUp 
    } from './loginStore';

class LoginStore{
    activation = new Activation(this);
    loginView = new LoginView(this);
    passRecovery = new PassRecovery(this);
    register = new Register(this);
    signUp = new SignUp(this);

    showLogoAnimation = true;
    
    @observable showLogo = true; 

    moveBack(){
        this.history.goBack();
        // this.currentPage--;        
    }

    backHandler(){
        if(this.removeMode){
            this.removeMode = false;
            return true;
        }
        else if(this.history.location.pathname == '/register'){            
            this.showLogo = true;            
            this.moveBack();
            return true;
        }
        else if(this.history.location.pathname != '/'){
            this.moveBack();
            return true;
        }
        return false;
    }

    goBack(){
        if(this.history.location.pathname == '/register'){            
            this.showLogo = true;            
            this.moveBack();
            return;
        }
        if(this.history.location.pathname != '/'){
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