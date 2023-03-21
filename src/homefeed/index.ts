import { API } from '../shared/api.constant';
import { Base } from '../base';
import { HOME, IAType, INVITE } from './types';
import { onValue, ref } from 'firebase/database';
import { db } from '../utils/firebase';
import { msg } from '../utils/firebase';

export class HomeFeed extends Base {
    getHomeFeedData(home: HOME): Promise<any> {
        return this.invoke(`${API.MY_CHATOOMS}?page=${home.page}`);
    }

    getInvites(invite: INVITE): Promise<any> {
        return this.invoke(`${API.CHANNEL_INVITES}?channel_type=${invite.channel_type}&page=${invite.page}&page_size=${invite.page_size}`);
    }

    inviteAction(iaType: IAType): Promise<any> {
        return this.invoke(`${API.CHANNEL_INVITE}`, {
            method: 'PUT',
            body: JSON.stringify(iaType),
        });
    }

    fbInstance() {
        const fbDatabase = db;
        return fbDatabase;
    }

    fireBaseDatabase() {
        const query = ref(db, 'collabcards');
        return onValue(query, (snapshot) => {
            if (snapshot.exists()) {
                const snap = snapshot.val();
                return snap;
            }
        });
    }

    fbMsg() {
        const message = msg;
        return message;
    }
}
