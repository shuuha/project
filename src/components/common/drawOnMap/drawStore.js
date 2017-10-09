import { observable, action, computed } from 'mobx';

class Item{
    @observable _isSelected = false;                    // selected in scroll view
    @observable  isSelectedOnBoard = false;             // selected on the board
    @observable eventId;

    isCreated = false;
    x;
    y;
    
    id = Math.round(Math.random() * 1000);

    constructor(name, x, y){
        this.name = name
        this.x = x;
        this.y = y;
    }

    changeCreated = () =>{
        this.isCreated = true;
    }

    @computed
    get isSelected(){
        return this._isSelected;
    }

    set isSelected(value){
        this._isSelected = value;
    }
}

class DrawStore{
    @observable data = [];
    @observable onBoardItems = [];

    constructor(data){
        this.data = data.map(q => new Item(q))
    }

    @computed
    get selectedItemName(){
        return this.data.find(q => q.isSelected).name;
    }

    @action
    boardSelectClear(){
        if(this.onBoardItems.some(q => q.isSelectedOnBoard));
            this.onBoardItems.forEach(q => q.isSelectedOnBoard = false);
    }

    @action
    addNewItemsOnBoard(x, y){

        const newItem = new Item(this.selectedItemName, x, y);
        newItem.isSelectedOnBoard = true;
        this.onBoardItems.push(newItem);        
        this.data.map(q => q.isSelected = false);
    }

    @action
    changeSelected(id){                                     // select only one item in the scroll        
        this.onBoardItems.forEach(q => q.isSelectedOnBoard = false)
        this.data = this.data.map(q => {
            if(q.id === id)
                q.isSelected = !q.isSelected;                                
            else 
                q.isSelected = false;
            
            return q;
        })
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
    onBoardSelect = (id) => {                                     // select only one item on the board
        this.data.forEach(q => q.isSelected = false);
        this.onBoardItems = this.onBoardItems.map(q => {            
            if(q.x === id)                                        // x (locationX) using as identifier
                q.isSelectedOnBoard = !q.isSelectedOnBoard;                                
            else 
                q.isSelectedOnBoard = false;
            
            return q;
        })
    }
}


const data = [
    "car", 
    "pointer",
    "trackmarks",
    "traffic-lights-green", 
    "traffic-lights-red", 
    "traffic-lights-yellow"
    ];

export const drawStore = new DrawStore(data);