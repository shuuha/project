import { observable, action, computed } from 'mobx';
import { imageNames } from '../data/imageNames';

class Item{
    @observable isSelected = false;                    // selected in scroll view
    @observable isSelectedOnBoard = false;             // selected on the board
    @observable isHidden = false;
    x;
    y;    
    id = Math.round(Math.random() * 1000);

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
    @observable data = [];
    @observable onBoardItems = [];
    @observable deleteIconPos;
    @observable deleteIconStyle;
    @observable showAddButton = true;
    @observable showList = false;    

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
    showItemsList = () => {
        this.showList = true;
        this.showAddButton = false;
    }

    @action
    hideItemsList = () => {
        this.showList = false;
        this.showAddButton = true;
    }

    @computed
    get selectedItemName(){
        return this.data.find(q => q.isSelected).name;
    }    

    @action
    boardSelectClear = () =>{
        if(this.onBoardItems.some(q => q.isSelectedOnBoard));
            this.onBoardItems.forEach(q => q.isSelectedOnBoard = false);
    }

    @action
    addNewItemsOnBoard = (x, y) => {

        const newItem = new Item(this.selectedItemName, x, y);
        newItem.isSelectedOnBoard = true;
        this.onBoardItems.push(newItem);        
        this.data.map(q => q.isSelected = false);
    }

    @action
    changeSelected = (id, e) =>{                                     // select only one item in the scroll        
        console.log(e);
        this.onBoardItems.forEach(q => q.isSelectedOnBoard = false)
        this.data = this.data.map(q => {
            if(q.id === id)
                q.isSelected = !q.isSelected;                                
            else 
                q.isSelected = false;
            
            return q;
        });
        this.hideItemsList();        
    }

    @computed
    get staticItems(){                                      // items in the scroll        
        return this.data;
    }

    @computed
    get dynamicItems(){                                     // items on the board        
        return this.onBoardItems;                                        // array of obj deployed on the board               
    }   

    @computed
    get canDeploy(){        
        return this.data.some(q => q.isSelected);
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