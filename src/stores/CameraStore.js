import { observable, computed, action } from 'mobx';

class Picture{
    id = Math.round(Math.random() * 1000);
    @observable checked = false;
    @observable value = '';
    @observable photo = '';    
    cameraStore;

    constructor(photo, cameraStore){
        this.photo = photo;
        this.cameraStore = cameraStore;
    }

    @action
    changeValue = (value) => {        
        this.value = value;
    }

    @action
    changeChecked = () => {
        this.checked = !this.checked;
    }

    @action
    onSubmitEditing = () => {        
        this.cameraStore.moveBack();
    }


    @action
    handlePress = () => {        
        if(this.cameraStore.removeMode){
            this.changeChecked();
        }
        else {
            this.cameraStore.history.push(`/camera/${this.id}`) 
        }
    }

    @computed
    get commentAbbr(){        
        return this.value.slice(0, 20) + '...';
    }
}

class CameraStore{
    @observable picturesList = [];
    @observable showDeleteButton = false;    
    @observable title = 'Photos';
    @observable removeMode = false;

    history;

    moveBack(){
        this.history.goBack();
        // this.currentPage--;        
    }

    backHandler(){
        if(this.removeMode){
            this.removeMode = false;
            return true;
        }
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


    @action
    takePicture = (camera) => {
        const options = {};
        //options.location = ...
        camera.capture({metadata: options})
        .then( data => console.log(data))
        .catch(err => console.error(err));
    }

    @action
    removeCheckedPictures = () => {
        this.picturesList = this.picturesList.filter(q => !q.checked);
    }

    @action
    removeSinglePicture = (id) => {
        this.picturesList = this.picturesList.filter(q => q.id !==id);
        this.goBack();
    }

    @action
    handleLongPress = () =>{
        this.removeMode = true;
    }

    @action
    headerRightButtonPress = () => {
        if(this.removeMode){
            this.removeCheckedPictures();
            this.removeMode = false;
        }
        else{
            this.history.push('/camera')
        }
    }
}

export const cameraStore = new CameraStore();
