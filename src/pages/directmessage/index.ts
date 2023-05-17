import { API } from '../../shared/constants/api.constant';
import { Base } from '../../base';
import { BlockMember, CANDM, CID, CheckDMLimit, CheckDMStatus, CreateDMChatroom, FetchDMFeed, GetAllMembers, SendDMRequest } from './types';

export class DmFeed extends Base {
    fetchDMFeed(fetchDMFeed: FetchDMFeed): Promise<any> {
        return this.invoke(`${API.CHATROOM_DM}?page=${fetchDMFeed.page}`);
    }

    checkDMStatus(checkDMStatus: CheckDMStatus): Promise<any> {
        return this.invoke(`${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}`);
    }

    getAllMembers(getAllMembers: GetAllMembers): Promise<any> {
        if (getAllMembers.memberState) {
            return this.invoke(
                `${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&member_state=${getAllMembers.memberState}&page=${getAllMembers.page}`
            );
        } else {
            return this.invoke(`${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&page=${getAllMembers.page}`);
        }
    }

    checkDMLimit(checkDMLimit: CheckDMLimit): Promise<any> {
        return this.invoke(`${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimit.memberId}`);
    }

    createDMChatroom(createDMChatroom: CreateDMChatroom): Promise<any> {
        return this.invoke(`${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            body: JSON.stringify(createDMChatroom),
        });
    }

    sendDMRequest(sendDMRequest: SendDMRequest): Promise<any> {
        return this.invoke(`${API.CHATROOM_DM_REQUEST}`, {
            method: 'POST',
            body: JSON.stringify(sendDMRequest),
        });
    }

    blockMember(blockMember: BlockMember): Promise<any> {
        return this.invoke(`${API.CHATROOM_DM_BLOCK}`, {
            method: 'POST',
            body: JSON.stringify(blockMember),
        });
    }

    checkDMTab(): Promise<any> {
        return this.invoke(`${API.HOME_DM_META}`);
    }

    // ******************

    getDMFeed(cid: CID): Promise<any> {
        return this.invoke(`${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
    }

    canDmFeed(dmCan: CANDM): Promise<any> {
        if (dmCan.chatroom_id) {
            return this.invoke(
                `${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}&chatroom_id=${dmCan.chatroom_id}`
            );
        } else {
            return this.invoke(
                `${API.DM_STATUS}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}`
            );
        }
    }
}
