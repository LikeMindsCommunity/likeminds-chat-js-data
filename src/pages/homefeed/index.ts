import { API } from '../../shared/constants/api.constant';
import { Base } from '../../base';
import { Device, HomeFeed, IAType, INVITE, Participant } from './types';
import { onValue, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import { msg } from '../../utils/firebase';

export class HomeFeedClient extends Base {
    getHomeFeed(homeFeed: HomeFeed): Promise<any> {
        return this.invoke(`${API.CHATROOM_MINE}?page=${homeFeed.page}`);
    }

    getInvites(invite: INVITE): Promise<any> {
        return this.invoke(`${API.CHANNEL_INVITES}?channel_type=${invite.channel_type}&page=${invite.page}&page_size=${invite.page_size}`);
    }

    sendInvites(participant: Participant): Promise<any> {
        return this.invoke(`${API.CHATROOM_PARTICIPANTS}`, {
            method: 'POST',
            body: JSON.stringify(participant),
        });
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

    homeFeedListener(callback: any, route: any) {
        const query = ref(db, route);
        return onValue(query, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        });
    }

    fbMsg() {
        const message = msg;
        return message;
    }
}
