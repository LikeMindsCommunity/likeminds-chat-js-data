import { API } from '../shared/api.constant';
import { Base } from '../base';
import { BLOCKCR, CANDM, CID, CREATDMTYPE, DMCTYPE, DMTYPE, REQDM, REQDMTYPE } from './types';

export class DmFeed extends Base {
    getDMFeed(cid: CID): Promise<any> {
        return this.invoke(`${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
    }

    canDmFeed(dmCan: CANDM): Promise<any> {
        if (dmCan.chatroom_id) {
            return this.invoke(
                `${API.CAN_DM}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}&chatroom_id=${dmCan.chatroom_id}`
            );
        } else {
            return this.invoke(`${API.CAN_DM}?community_id=${dmCan.community_id}&req_from=${dmCan.req_from}&member_id=${dmCan.member_id}`);
        }
    }

    onCreateDM(cDm: CREATDMTYPE): Promise<any> {
        return this.invoke(`${API.CHATROOM_CREATE_DM}`, {
            method: 'POST',
            body: JSON.stringify(cDm),
        });
    }

    DmChatroom(dmcType: DMCTYPE): Promise<any> {
        return this.invoke(`${API.FETCH_DM_CHATROOMS}?community_id=${dmcType.community_id}&page=${dmcType.page}`);
    }

    reqDmFeed(reqDmType: REQDMTYPE): Promise<any> {
        return this.invoke(`${API.REQUEST_DM_LIMIT}?community_id=${reqDmType.community_id}&member_id=${reqDmType.member_id}`);
    }

    requestDmAction(reqDm: REQDM): Promise<any> {
        return this.invoke(`${API.CHATROOM_REQUEST_DM}`, {
            method: 'POST',
            body: JSON.stringify(reqDm),
        });
    }

    blockCR(bcr: BLOCKCR): Promise<any> {
        return this.invoke(`${API.CHATROOM_BLOCK}`, {
            method: 'POST',
            body: JSON.stringify(bcr),
        });
    }
}
