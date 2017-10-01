import { observable, computed, action } from 'mobx';
import uniqueId from 'react-native-unique-id';
import axios from 'axios';

import PageStore from './PageStore';

export class AppStore{

    @observable pages = [];
    @observable loading = false;
    @observable modalVisible = false;
    @observable connectionError = false;

    // @observable _lastPage = 0;
    currentPage = 1;
    id;
    history;

    constructor(){
        uniqueId((err, id)=>{
            this.id = id
        });

        this.loadData();
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

    postData(data){
        this.loading = true;

        return axios.post('http://app.yayintel.com/', data )
            .then(() => {
                        this.loading = false;
                        console.log(this.loading);
                        return this.loading;
                    })
            .then(() => this.goForward())
            .catch(err => {
                        console.log(err, 'unable to send data')
                        this.loading = false;
                        this.showModal();
                    });
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