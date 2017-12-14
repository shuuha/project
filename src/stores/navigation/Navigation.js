import { observable, computed, action } from 'mobx';

import { LevelOne, LevelTwo } from '../navigation';

export class Navigation {
    constructor(appStore) {
        this.appStore = appStore;
    }

    levelOne = new LevelOne(this);
    levelTwo = new LevelTwo(this);

    @observable showBackButton = false;
}