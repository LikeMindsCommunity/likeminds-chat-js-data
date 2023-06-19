import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';

import { BlockMember, CANDM, CID, CheckDMLimit, CheckDMStatus, CreateDMChatroom, FetchDMFeed, SendDMRequest } from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';

export class DirectMessage extends Base {
    public networkLibrary = new NetworkLibrary();
    fetchDMFeed(fetchDMFeed: FetchDMFeed): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM}?page=${fetchDMFeed.page}`);
    }

    checkDMStatus(checkDMStatus: CheckDMStatus): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}`);
    }

    checkDMLimit(checkDMLimit: CheckDMLimit): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimit.memberId}`
        );
    }

    createDMChatroom(createDMChatroom: CreateDMChatroom): Promise<any> {
        const params = {
            member_id: createDMChatroom.memberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    sendDMRequest(sendDMRequest: SendDMRequest): Promise<any> {
        const params = {
            chatroom_id: sendDMRequest.chatroomId,
            chat_request_state: sendDMRequest.chatRequestState,
            text: sendDMRequest.text,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_REQUEST}`, {
            method: 'POST',
            data: params,
        });
    }

    blockMember(blockMember: BlockMember): Promise<any> {
        const params = {
            chatroom_id: blockMember.chatroomId,
            status: blockMember.status,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_BLOCK}`, {
            method: 'POST',
            data: params,
        });
    }

    checkDMTab(): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.HOME_DM_META}`);
    }

    // ******************

    getDMFeed(cid: CID): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
    }

    canDmFeed(dmCan: CANDM): Promise<any> {
        if (dmCan.chatroom_id) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}&chatroom_id=${dmCan.chatroom_id}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}`
            );
        }
    }
}
