import { API } from '../../shared/constants/api.constant';
import { Device, HomeFeed, IaType, INVITE, Participant } from './types';
import { onValue, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import { msg } from '../../utils/firebase';
import httpInst from 'src/core/services/base.service';

export class HomeFeedClient {
    getHomeFeed(homeFeed: HomeFeed): Promise<any> {
        return httpInst.get(`${API.CHATROOM_MINE}?page=${homeFeed.page}`);
    }

    getInvites(invite: INVITE): Promise<any> {
        return httpInst(`${API.CHANNEL_INVITES}?channel_type=${invite.channel_type}&page=${invite.page}&page_size=${invite.page_size}`);
    }

    sendInvites(participant: Participant): Promise<any> {
        const params = {
            chatroom_id: participant.chatroomId,
            is_secret: participant.isSecret,
            chatroom_participants: participant.chatroomParticipants,
        };
        return httpInst.post(`${API.CHATROOM_PARTICIPANTS}`, params);
    }

    registerDevice(device: Device): Promise<any> {
        return httpInst.post(`${API.USER_DEVICE_PUSH}`, {
            token: device.token,
        });
    }

    inviteAction(iaType: IaType): Promise<any> {
        const params = {
            channel_id: iaType.channelId,
            invite_status: iaType.inviteStatus,
        };
        return httpInst.put(`${API.CHANNEL_INVITE}`, params);
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
