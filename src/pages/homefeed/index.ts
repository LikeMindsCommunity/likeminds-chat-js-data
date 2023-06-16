import { API } from '../../shared/constants/api.constant';
import { Device, HomeFeed, IaType, INVITE, Participant } from './types';
import { onValue, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import { msg } from '../../utils/firebase';
import { environment } from 'src/environment';
import NetworkLibrary from 'src/core/services/networklibrary';

export class HomeFeedClient {
    public networkLibrary = new NetworkLibrary();
    getHomeFeed(homeFeed: HomeFeed): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${API.CHATROOM_MINE}?page=${homeFeed.page}`);
    }

    getInvites(invite: INVITE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${API.CHANNEL_INVITES}?channel_type=${invite.channelType}&page=${invite.page}&page_size=${invite.pageSize}`
        );
    }

    sendInvites(participant: Participant): Promise<any> {
        const params = {
            chatroom_id: participant.chatroomId,
            is_secret: participant.isSecret,
            chatroom_participants: participant.chatroomParticipants,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}`, {
            method: 'POST',
            data: params,
        });
    }

    registerDevice(device: Device): Promise<any> {
        const params = {
            token: device.token,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.USER_DEVICE_PUSH}`, {
            method: 'POST',
            data: params,
        });
    }

    inviteAction(iaType: IaType): Promise<any> {
        const params = {
            channel_id: iaType.channelId,
            invite_status: iaType.inviteStatus,
        };

        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHANNEL_INVITE}`, {
            method: 'PUT',
            data: params,
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
