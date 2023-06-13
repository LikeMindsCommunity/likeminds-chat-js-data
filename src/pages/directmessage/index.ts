import { API } from '../../shared/constants/api.constant';
import httpInst from 'src/core/services/base.service';
import { BlockMember, CANDM, CID, CheckDMLimit, CheckDMStatus, CreateDMChatroom, FetchDMFeed, SendDMRequest } from './types';

export class DmFeed {
    fetchDMFeed(fetchDMFeed: FetchDMFeed): Promise<any> {
        return httpInst.get(`${API.CHATROOM_DM}?page=${fetchDMFeed.page}`);
    }

    checkDMStatus(checkDMStatus: CheckDMStatus): Promise<any> {
        return httpInst.get(`${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}`);
    }

    checkDMLimit(checkDMLimit: CheckDMLimit): Promise<any> {
        return httpInst.get(`${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimit.memberId}`);
    }

    createDMChatroom(createDMChatroom: CreateDMChatroom): Promise<any> {
        return httpInst.post(`${API.CHATROOM_DM_CREATE}`, {
            member_id: createDMChatroom.memberId,
        });
    }

    sendDMRequest(sendDMRequest: SendDMRequest): Promise<any> {
        const params = {
            chatroom_id: sendDMRequest.chatroomId,
            chat_request_state: sendDMRequest.chatRequestState,
            text: sendDMRequest.text,
        };
        return httpInst.post(`${API.CHATROOM_DM_REQUEST}`, params);
    }

    blockMember(blockMember: BlockMember): Promise<any> {
        const params = {
            chatroom_id: blockMember.chatroomId,
            status: blockMember.status,
        };
        return httpInst.post(`${API.CHATROOM_DM_BLOCK}`, params);
    }

    checkDMTab(): Promise<any> {
        return httpInst.get(`${API.HOME_DM_META}`);
    }

    // ******************

    getDMFeed(cid: CID): Promise<any> {
        return httpInst.get(`${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
    }

    canDmFeed(dmCan: CANDM): Promise<any> {
        if (dmCan.chatroom_id) {
            return httpInst.get(
                `${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}&chatroom_id=${dmCan.chatroom_id}`
            );
        } else {
            return httpInst.get(
                `${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}`
            );
        }
    }
}
