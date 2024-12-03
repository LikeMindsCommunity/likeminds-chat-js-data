/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from '../../shared/constants/api.constant';
import { Device, GetHomeFeedRequest, IaType, INVITE, Participant } from './types';
import { onValue, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import { SyncChatroomResponse } from '../../shared/api-responses/getChatroomSync';
import LMResponse from '../../core/services/lmresponse';

export class HomeFeedClient extends Base {
    getHomeFeed(getHomeFeedRequest: GetHomeFeedRequest): Promise<LMResponse<SyncChatroomResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<SyncChatroomResponse>(
            `${environment.apiUrl}${API.CHATROOM_SYNC}?page=${getHomeFeedRequest.page}&page_size=${getHomeFeedRequest.pageSize}&chatroom_types=${getHomeFeedRequest.chatroomTypes}&max_timestamp=${getHomeFeedRequest.maxTimestamp}&min_timestamp=${getHomeFeedRequest.minTimestamp}`
        );
    }

    getInvites(invite: INVITE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHANNEL_INVITES}?channel_type=${invite.channelType}&page=${invite.page}&page_size=${invite.pageSize}`
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
            headers: {
                'x-device-id': device.xDeviceId,
                'x-platform-code': device.xPlatformCode,
            },
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

    // fbMsg() {
    //     const message = msg;
    //     return message;
    // }
}
