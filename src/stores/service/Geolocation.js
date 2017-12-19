import { observable, computed, action } from 'mobx';

export class Geolocation {

    CURRENT_LOCATION_TIMEOUT = 10000;

    constructor(serviceStore) {
        this.serviceStore = serviceStore;
    }

    get appStore() {
        return this.serviceStore.appStore;
    }

    getCurrentLocation = () => {
        const promise = new Promise((resolve, reject)=> {
            navigator.geolocation.getCurrentPosition(({coords}) => {
                const { latitude, longitude } = coords;
                this.appStore.user.lat = latitude;
                this.appStore.user.lng = longitude;
                // this.appStore.user.lat = 100;
                // this.appStore.user.lng = 100;
                resolve(coords);
            },
            (error) => {
                this.appStore.loading = false;
                this.appStore.errorText = 'No location provider available';
                console.log(JSON.stringify(error));
                reject(error)},
            {timeout: this.CURRENT_LOCATION_TIMEOUT} 
            );
        });

        return promise;
    }
}

