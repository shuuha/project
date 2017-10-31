import { observable, computed, action } from 'mobx';
import axios from 'axios';

class LoginStore{    
    @observable email;
    @observable pass;
    @observable isOnline = false;
    
    moveToNext = false;
    
    onLoginButtonPress = () => {
        axios.get(`/${this.email}`)
        .then((res)=> console.log(res))
        .catch((err)=> console.log(res));
    }

    onLoginWithFbButtonPress = () => {
        
    }

    

    
}

const loginStore = new LoginStore();