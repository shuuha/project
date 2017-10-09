import { observable, computed, action } from 'mobx';

class DrawOnMap{
    @observable uri;
    @observable initialRegion = {};
    @observable imgLoaded = false;


    takeSnapshot(ref){
    ref.takeSnapshot({
                        width,      
                        height,     
                        format: 'png',
                        quality: 0.8, 
                        result: 'file'
                    })
                .then((uri) => this.setState({ mapSnapshot: uri }))
                .then(() => this.setState({ imgLoaded: true })        
    )}

}