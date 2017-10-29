import { observable, action, computed } from 'mobx';
import { imageNames } from '../data/imageNames';
import { Animated } from 'react-native';

class Item{
    @observable isSelected = false;                    // selected in scroll view
    @observable isSelectedOnBoard = false;             // selected on the board
    @observable isHidden = false;
    @observable dragActive = false;      
    x = 0;
    y = 0;
    panId;
    rotateId;
    pinchId;
    id = Math.round(Math.random() * 10000);

    constructor(name, x, y){
        this.name = name
        this.x = x;
        this.y = y;
    }

    @action
    hideItem = () => {        
        this.isHidden = true;
    }

}

class DrawingStore{
    @observable data = [];                              // objects on the overlay
    @observable onBoardItems = [];                      // objects on the board
    @observable deleteIconPos;
    @observable deleteIconStyle;
    @observable showAddButton = true;
    @observable showList = false;
    @observable imageScale = 1;
    @observable canDrag = false;
    @observable hideCloseButton = false;
    @observable deleteButtonVisible = false;
    @observable gestureEnabledOnlyInOverlay = false;    
    translateX = 0;
    translateY = 0;
    timerId;
    

    constructor(data){
        this.data = data.map(q => new Item(q))
    }
 
    //navigation
    currentPage = 1;
    id;
    history;

    @action
    getDeleteIconPos = (newPosition) => {
        if(newPosition){
            newPosition.measure((x, y, width, height, pageX, pageY) => {
            this.deleteIconPos = {
                pageX,
                pageY
            };
        })}        
    }

    @action
    showOverlay = () => {
        this.showList = true;
        this.showAddButton = false;
        this.gestureEnabledOnlyInOverlay = true;
    }

    @action
    hideOverlay = () => {        
        this.showList = false;
        this.showAddButton = true;
        this.gestureEnabledOnlyInOverlay = false;
    }    

    @action
    hideDeleteButtonWithDelay = () => {
        this.timerId = setTimeout(()=> {            
            this.deleteButtonVisible = false;            
        }, 2000)
    }

    @action
    showDeleteButton = () => {        
        clearTimeout(this.timerId);
        this.deleteButtonVisible = true;        
    }

    get panIds(){
        return this.onBoardItems.map(q => q.panId);                // array of ids for panhandler
    }

    get rotateIds(){                                                     // array of ids for rotatehandler
        return this.onBoardItems.map(q => q.rotate);
    }

    get pinchIds(){ 
        return this.onBoardItems.map(q => q.pinchId);
    }
 

    @action
    boardSelectClear = () =>{
        if(this.onBoardItems.some(q => q.isSelectedOnBoard));
            this.onBoardItems.forEach(q => q.isSelectedOnBoard = false);
    }

    random(){
        return Math.round(Math.random() * 10000);
    }

    @action
    addNewItemOnBoard = (name, x, y) => {                                //deploy a selected item on the board        
        const newItem = new Item(name, x, y);
        newItem.panId = this.random() + '';
        newItem.rotateId = this.random() + '';
        newItem.pinchId = this.random() + '';
        newItem.isSelectedOnBoard = true;
        this.onBoardItems.push(newItem);
    }

    disselectAllOnBoard = () => {
        this.onBoardItems.forEach(q => q.isSelectedOnBoard = false);
    }

    @action
    changeSelected = (id) =>{                                     // select an item in overlay to deploy on the board        
        this.disselectAllOnBoard();
        this.data.forEach(q => { if(q.id === id)
                                    q.isSelected = true;
        });        
    }

    @computed
    get anySelected(){
        return this.data.some(q => q.isHidden)
    }

    @action
    selectOne = (id) => {                                  // leave only one selected item on the overlay
        this.disselectAllOnBoard();
        this.data.forEach(q => { if(q.id !== id)
                                    q.isHidden = true;
                                 else {
                                    q.dragActive = true;     // and make the element draggable
                                    q.isSelected = true;
                                }
        });
        this.hideCloseButton = true;
    }

    @action
    hideAll = () => {
        this.data.forEach(q => q.isHidden = true);
    }

    @action
    showAll = () => {
        this.data.forEach(q => q.isHidden = false);
    }

    @action
    setOverlayInitialState = () => {
        this.showAll();
        this.data.forEach(q => {
            q.dragActive = false;
            q.isSelected = false;
        })
        this.hideCloseButton = false;
    }

    @computed
    get staticItems(){                                      // items in the overlay
        return this.data;
    }

    @computed
    get dynamicItems(){                                     // items on the board                
        return this.onBoardItems;                                    // array of obj deployed on the board               
    }    

    @action
    selectOnBoard = (id) => {        
        this.onBoardItems.forEach(q => {
            if(q.x === id)
                q.isSelectedOnBoard = true;
            else
                q.isSelectedOnBoard = false;
        })
    }

    //navigation
    moveBack(){
        this.history.goBack();
    }

    //navigation
    backHandler(){        
        if(this.history.location.pathname != '/'){
            this.moveBack();
            return true;
        }

        return false;
    }

    //navigation
    goBack(){
        if(this.history.location.pathname != '/')
            this.moveBack()
    } 
}

export const drawingStore = new DrawingStore(imageNames);