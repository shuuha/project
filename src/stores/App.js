import { observable, computed, action } from 'mobx';
import uniqueId from 'react-native-unique-id';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

import PageStore from './PageStore';
import { Login, Service, Navigation } from '../stores';

class App{

    URL_NEWUSER = 'http://app.yayintel.com:8883/api/newuser';
    URL_AUTH = 'http://app.yayintel.com:8883/api/authenticate';
    URL_ONLINE = 'http://app.yayintel.com:8883/api/online';
    URL_FB = 'http://app.yayintel.com:8883/api/authenticate/facebook'; 
    URL_MAIN = "http://app.yayintel.com/";
    
    @observable pages = [];
    @observable loading = false;
    @observable loadingOnTokenCheck = null;
    @observable errorText = null;
    @observable modalVisible = false;
    @observable connectionError = false;
    // @observable dataLoaded = false;
    
    // @observable _lastPage = 0;    

    @observable showBackButton = true;
    @observable
    user = {
        fullname: '',
        phone: '',
        email: '',
        pass: '',
        token: '',
        lat: null,
        lng: null,
        online: false,
        loggedIn: false
    };
    
    @observable showLogo = true;
    @observable showLogoAnimation = true;
    dataLoaded = true;
    id = null;   
    
    currentPage = 1;    

    constructor(){        
        this.loadData();
    };
    
    login = new Login(this);
    service = new Service(this);
    navigation = new Navigation(this);

    @action
    setInitialState = () => {
        this.errorText = null;
        this.loading = false;
    }

    saveTokenToStorage = () => {
        return AsyncStorage.setItem('token', this.user.token)            
            .catch( err => console.log(err));
    }

    getTokenFromStorage = () => {
        return AsyncStorage.getItem('token')            
            .catch(err => console.log(err));
    }

    removeTokenFromStorage = () => {
        return AsyncStorage.removeItem('token')
            .catch(err => console.log(err));
    }    

    appInit = () => {
        this.loadingOnTokenCheck = true;        
        this.getTokenFromStorage()
            .then( token => {
                if (token) {
                    const userData = {
                        token,
                        position: {
                            lat: store.user.lat || "0",
                            lng: store.user.lng || "0"
                        }
                    };
                    return axios.post(this.URL_ONLINE, userData)
                        .then( res => {
                            if (res.data.success) {
                                this.user.loggedIn = true;
                                this.loadingOnTokenCheck = false;
                                this.showLogoAnimation = false;
                            }})
                } else {
                    this.loadingOnTokenCheck = false;
                }
            })
            .catch( err => {
                this.loadingOnTokenCheck = false;
                console.log('error getting user data ' + err)});
    }



    // loadData(){
    //     uniqueId()
    //         .then(id => this.id = id)
    //         .then(() => axios.get(this.URL_MAIN + this.id)
    //         // .then((res)=> console.log(res))
    //         .then((res) => this.pages = Object.keys(res.data).map(q => new PageStore(res.data[q], this)))
    //         .then(()=> this.dataLoaded = true)
    //         .catch(err => console.log(err))
    //         )}   
    
    postData(data){
        this.loading = true;

        return axios.post(this.URL_MAIN, data )
            .then(() => this.loading = false)
            .then(() => this.goForward())
            .catch(err => {
                        console.log(err, 'unable to send data')
                        this.loading = false;
                        this.showModal();
                    });
    }

    @action
    loadData(){
        let temp = require('../data/data.json');        
        this.pages = Object.keys(temp).map(q => new PageStore(temp[q], this));
    }   

    @computed
    get lastPage(){
        return this.pages.length > this._lastPage;
    }

    set lastPage(value){
        this._lastPage = value;
    }

    get uniqueId(){
        return this.id;
    }
    
    showModal() {
        this.modalVisible = true;
    }

    hideModal(){
        this.modalVisible = false;
    }


    moveBack(){
        this.history.goBack();
        this.currentPage--;        
    }

    backHandler(){        
        if(this.history.location.pathname != '/'){
            this.moveBack();

            return true;
        }

        return false;
    }

    goBack(){
        if(this.history.location.pathname != '/')
            this.moveBack()
    }

    goForward(){
        if(this.pages.length - 1 >= this.currentPage){
            const pathname  = this.history.location.pathname.slice(0, 1);
            const path = pathname + this.currentPage++;
            this.history.push(path);            
        }
    }
}

export const store = new App();