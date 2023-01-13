import { API } from '../shared/api.constant';
import { Base } from '../base';
import { HOME } from './types';
import { db } from '../utils/firebase';
// import { onValue, ref } from 'firebase/database';

export class HomeFeed extends Base {
    getHomeFeedData(home: HOME): Promise<any> {
        return this.invoke(`${API.MY_CHATOOMS}?page=${home.page}`);
        // return this.invoke(`${API.MY_CHATOOMS}?community_id=${home.communityId}&page=${home.page}`);
    }

    fbInstance() {
        const fbDatabase = db;
        return fbDatabase;
    }
}
