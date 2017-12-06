import { observable, computed, action } from 'mobx';
import { ListView, CameraRoll, Platform } from 'react-native';
import { _ } from 'lodash';

export class Photos {   

    @observable photos = [];
    @observable imageUri;
    loadingMore = false;
    lastCursor = null;
    noMorePhotos = false;
    _dataSource = {};
    
    constructor(registerStore) {
        this.register = registerStore;
    }

    get appStore() {
        return this.register.loginStore.appStore;
    }

    get navigation() {
        return this.appStore.navigation;
    }

    @computed
    get dataSource() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this._dataSource = ds.cloneWithRows([...this.photos]);
        return this._dataSource;
    }


    getFetchParams = (newProp) => {
        const params = {
            first: 35,
            groupName: 'Camera',
            groupTypes: 'All',
            assetType: 'Photos',
            ...newProp
        };
        if (Platform.OS === 'android') {
            delete params.groupTypes;
        } else {
            delete params.groupName;
        }

        return params;
    }


    getInitialPhotos = () => {
        if (!this.noMorePhotos) {
            CameraRoll.getPhotos(this.getFetchParams())
            .then((res) => {
                this.noMorePhotos = !res.page_info.has_next_page;
                this.photos = this.photos.concat(res.edges);
            })
            .catch((err) => console.log(err));
        }
    }

    tryPhotoLoad = () => {
        
        if (!this.loadingMore && !this.noMorePhotos) {
            this.loadingMore = true;
            this.loadPhotos();
        }
    }

    loadPhotos = () => {
        // if (this.lastCursor) {
            const newParams = this.getFetchParams({after: this.lastCursor})
        // }

        CameraRoll.getPhotos(newParams)
            .then((data) => {
                this.appendAssets(data);
            })
            .catch((e) => console.log(e));
    }

    appendAssets = (data) => {
        const assets = data.edges;
        const nextState = {
            loadingMore: false,
        };

        if (!data.page_info.has_next_page) {
            nextState.noMorePhotos = true;
        }

        if (assets.length > 0) {
            nextState.lastCursor = data.page_info.end_cursor;
            this.photos = this.photos.concat(assets);
            this._dataSource = this._dataSource.cloneWithRows(
            _.chunk(nextState.assets, 3)
        );
    }

        this.loadingMore = nextState.loadingMore;
        this.lastCursor = nextState.lastCursor;
        this.noMorePhotos = nextState.noMorePhotos;
    }

    endReached = () => {
        if (!this.noMorePhotos) {
            this.tryPhotoLoad();
        }
    }

    selectImage = (uri) => {
        this.imageUri = uri;
        this.navigation.levelTwo.moveBack();
    }
}