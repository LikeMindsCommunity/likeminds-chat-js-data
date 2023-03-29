import { API } from '../shared/api.constant';
import { Base } from '../base';
import { Device, HOME, IAType, INVITE } from './types';
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

    registerDevice(device: Device): Promise<any> {
        return this.invoke(`${API.USER_DEVICE_PUSH}`, {
            method: 'POST',
            body: JSON.stringify(device),
        });
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

    homeFeedListener() {
        const community = JSON.parse(localStorage.getItem('__community__'));
        const query = ref(db, `community/${community.id}`);
        return onValue(query, (snapshot) => {
            if (snapshot.exists()) {
                const snapChatroomId = snapshot.val().chatroom_id;
                fetch(`${API.FETCH_CHATROOM_HOME}?chatroom_id=${snapChatroomId}`)
                    .then((res) => res.json())
                    .then((res: any) => {
                        return res;
                    });
            }
        });
    }

    fbMsg() {
        const message = msg;
        return message;
    }
}
