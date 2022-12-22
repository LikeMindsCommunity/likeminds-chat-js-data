import { API } from "../shared/api.constant";
import { Base } from "../base";
import { UserType } from "./types";

export class Member extends Base {
  allMembers(ut: UserType): Promise<any> {
    return this.invoke(
      `${API.ALL_MEMBERS}?community_id=${ut.community_id}&chatroom_id=${ut.chatroom_id}&page=${ut.page}`
    );
  }
}
