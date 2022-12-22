import * as AWS from "aws-sdk";
import { Base } from "../base";
import { API } from "../shared/api.constant";
import {
  Action,
  CRSeen,
  ChatroomType,
  ConversationCreateData,
  ConversationData,
  FeedData,
  FollowCRType,
  LeaveCR,
  Media,
  Profile,
  PushReportType,
  Read,
  TaggingList,
  Upload,
} from "./types";

export class Chatroom extends Base {
  followCR(followCRType: FollowCRType): Promise<any> {
    return this.invoke(`${API.COLLABCARD_FOLLOW}`, {
      method: "POST",
      body: JSON.stringify(followCRType),
    });
  }

  fetchFeedData(fd: FeedData): Promise<any> {
    return this.invoke(
      `${API.COMMUNITY_MEMBER_FETCH_FEED}?community_id=${fd.community_id}&order_type=${fd.order_type}&page=${fd.page}`
    );
  }

  // Upload Media Fn Start
  getAWS(): any {
    (AWS.config.region = "ap-south-1"),
      (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "ap-south-1:181963ba-f2db-450b-8199-964a941b38c2",
      }));
    const s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: "beta-likeminds-media" },
    });

    return s3;
  }

  uploadMedia(media: Media) {
    let mediaObject = this.getAWS().upload({
      Key: `files/collabcard/${media.chatroomId}/conversation/${media.messageId}/${media.file.name}`,
      Bucket: "beta-likeminds-media",
      Body: media.file,
      ACL: "public-read-write",
      ContentType: media.file.type,
    });
    return mediaObject.promise();
  }
  // Upload Media Fn End

  getChatroom(cID: ChatroomType): Promise<any> {
    return this.invoke(`${API.CHATROOM_FETCH}?chatroom_id=${cID}`);
  }

  getTaggingList(taggingList: TaggingList): Promise<any> {
    return this.invoke(
      `${API.CHATROOM_GET_TAGGINNG_LIST}?community_id=${taggingList.community_id}&chatroom_id=${taggingList.chatroom_id}`
    );
  }

  getReportTags(): Promise<any> {
    return this.invoke(`${API.FETCH_REPORT_TAGS}`);
  }

  pushReport(pushReportType: PushReportType): Promise<any> {
    return this.invoke(`${API.PUSH_REPORT}`, {
      method: "POST",
      body: JSON.stringify(pushReportType),
    });
  }

  onUploadFile(upload: Upload): Promise<any> {
    return this.invoke(`${API.UPLOAD_FILES}`, {
      method: "POST",
      body: JSON.stringify(upload),
    });
  }

  leaveChatroom(leave: LeaveCR): Promise<any> {
    return this.invoke(
      `${API.COLLABCARD_FOLLOW}?collabcard_id=${leave.collabcard_id}&member_id=${leave.member_id}&value=${leave.value}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );
  }

  getConversations(conversationData: ConversationData): Promise<any> {
    return this.invoke(
      `${API.CONVERSATION_FETCH}?chatroom_id=${conversationData.chatroomID}&paginate_by=${conversationData.page}`
    );
  }

  profileData(profile: Profile): Promise<any> {
    return this.invoke(
      `${API.MEMBER_STATE}?community_id=${profile.community_id}&member_id=${profile.member_id}`
    );
  }

  onConversationsCreate(
    newConversations: ConversationCreateData
  ): Promise<any> {
    return this.invoke(`${API.CONVERSATION_CREATE}`, {
      method: "POST",
      body: JSON.stringify(newConversations),
    });
  }

  addAction(action: Action): Promise<any> {
    return this.invoke(`${API.CONVERSATION_ADD_ACTION}`, {
      method: "POST",
      body: JSON.stringify(action),
    });
  }

  markReadFn(mr: Read): Promise<any> {
    return this.invoke(`${API.MARK_READ}`, {
      method: "POST",
      body: JSON.stringify(mr),
    });
  }

  crSeenFn(mr: CRSeen): Promise<any> {
    return this.invoke(`${API.COLLABCARD_SEEN}`, {
      method: "POST",
      body: JSON.stringify(mr),
    });
  }
}
