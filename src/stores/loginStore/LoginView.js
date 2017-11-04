import { observable, computer, action } from 'mobx';

export class LoginView{

    @observable email = '';
    @observable pass = '';

    isLoginViewInitialRender = true;

    constructor(loginStore){
        this.loginStore = loginStore;
    }

    @action
    onChangeEmail = (e) => {
        this.email = e;
    }

    @action
    onChangePass = (p) => {
        this.pass = p;
        console.log(this.pass);
    }

    onLoginButtonPress = () => {
        axios.get(`/${this.email}`)
        .then((res)=> console.log(res))
        .catch((err)=> console.log(res));
    }

    onForgotPassPress = () => {
        this.loginStore.history.push('/passrecovery');
    }

    onSignUpPress = () => {
        this.loginStore.history.push('/signup');

    }

    onEnterPhoneNo = () => {
        this.loginStore.history.push('/activation');
    }
    
    onLoginWithFbButtonPress = () => {
        
    }    
}