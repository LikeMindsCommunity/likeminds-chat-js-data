import { API } from "../shared/api.constant";
import { Base } from "../base";
import { CRid, Home } from "./types";
import { db } from "../utils/firebase";
import { onValue, ref } from "firebase/database";

export class HomeFeed extends Base {
  getHomeFeedData(home: Home): Promise<any> {
    return this.invoke(
      `${API.MY_CHATOOMS}?community_id=${home.communityId}&page=${home.page}`
    );
  }

  fb(cid: CRid) {
    const query = ref(db, `collabcards/${cid.chatroom_id}`);
    onValue(query, (snapshot) => {
      const data = snapshot.val();
      return data;
      // if (snapshot.exists()) {
      //   Object.values(data).map((project) => {
      //     setProjects((projects) => [...projects, project]);
      //   });
      // }
    });
  }
}
