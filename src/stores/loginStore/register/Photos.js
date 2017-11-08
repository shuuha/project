import { observable, computed, action } from 'mobx';
import { ListView, CameraRoll, Platform } from 'react-native';
import { _ } from 'lodash';

export class Photos{   

    @observable photos = [];
    @observable imageUri;
    loadingMore = false;
    lastCursor = null;
    noMorePhotos = false;
    _dataSource = {};
    
    constructor(registerStore){
        this.register = registerStore;
    }

    @computed
    get dataSource(){
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this._dataSource = ds.cloneWithRows([...this.photos]);
        return this._dataSource;
    }

    getPhotos = () => {
        CameraRoll.getPhotos({
            first: 35,
            groupName: 'Camera',
            assetType: 'Photos'
        })
        .then((res) => {
            this.photos = this.photos.concat(res.edges);
        })
        .catch((err) => console.log(err));
    }

    tryPhotoLoad = () => {
        if (!this.loadingMore) {
            this.loadingMore = true;
            this.loadPhotos();
        }
    }

    loadPhotos = () => {
        const fetchParams = {
            first: 35,
            groupName: 'Camera',
            assetType: 'Photos',
        };

        // if (Platform.OS === 'android') {
        // // not supported in android
        //     delete fetchParams.groupTypes;
        // }

        if (this.lastCursor) {
            fetchParams.after = this.lastCursor;
        }

        CameraRoll.getPhotos(fetchParams).then((data) => {
            this.appendAssets(data);
        }).catch((e) => {
            console.log(e);
        });
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
        this.register.loginStore.history.goBack();
    }
}