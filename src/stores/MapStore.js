import { observable, action, computed } from 'mobx';

class MapStore{
    @observable regionLoaded = false;
    @observable isImageLoading = false;
    @observable region;
    @observable selectedMapType;
    @observable latitude;
    @observable longitude;
    @observable selectedMapType = 'standard';
    @observable buttonLabel = 'Switch to hybrid';
    regionLoaded = false;
    watchId;

    mapUri;
    history;

    backHandler(){
        if(this.history.location.pathname != '/'){
            this.history.goBack();
            return true;
        }
        return false;
    }

    regionChangeComplete = (e) => {
        if(e){            
            this.regionLoaded = true;
        }
    }

    @action
    takeSnapshot = (map) => {
        if(this.regionLoaded){
            map.takeSnapshot({
                // width,      // optional, when omitted the view-width is used
                // height,     // optional, when omitted the view-height is used        
                format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
                quality: 1,    // image quality: 0..1 (only relevant for jpg, default: 1)
                // result: 'file'   // result types: 'file', 'base64' (default: 'file')
            })
                .then((uri) => this.mapUri = uri)                
                .then(()=> {this.history.push('/drawing');
                            console.log('done, pushed to /drawing');
                            })
                .catch((e)=> console.log(e));
        }
    }
    
    @action
    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(({coords}) => {
            const { latitude, longitude } = coords;
            this.latitude = latitude;
            this.longitude = longitude;
            this.region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.001,
                }       
            },
        (error) => alert(JSON.stringify(error)),
        {timeout: 10000}
            ), 
        this.regionLoaded = true;
    }

    @action
    switchMapType = () =>{
        if(this.selectedMapType === 'standard'){
            this.selectedMapType = 'satellite'
            this.buttonLabel = 'Switch to standard'
        }
        else {
            this.selectedMapType = 'standard'
            this.buttonLabel = 'Switch to hybrid'
        }
    }

    watchPosition(){
        this.watchID = navigator.geolocation.watchPosition(
            ({coords}) => { 
            const {latitude, longitude} = coords;
            this.latitude = latitude;
            this.longitude = longitude;     
            }
        );
    }

    clearWatch(){
        navigator.geolocation.clearWatch(this.watchID)
    }

}

export const mapStore = new MapStore();