import { API } from "../shared/api.constant";
import { Base } from "../base";
import { CID, DMCTYPE, DMTYPE } from "./types";

export class DmFeed extends Base {
  getDMFeed(cid: CID): Promise<any> {
    return this.invoke(`${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
  }

  canDmFeed(dmCan: CID): Promise<any> {
    return this.invoke(
      `${API.CAN_DM}?community_id=${dmCan.community_id}&req_from=dm_feed`
    );
  }

  DmChatroom(dmcType: DMCTYPE): Promise<any> {
    return this.invoke(
      `${API.FETCH_DM_CHATROOMS}?community_id=${dmcType.community_id}&page=${dmcType.page}`
    );
  }
}
