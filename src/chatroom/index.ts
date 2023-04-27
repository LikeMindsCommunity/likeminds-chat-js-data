import * as AWS from 'aws-sdk';
import { Base } from '../base';
import { API } from '../shared/api.constant';
import {
    Action,
    Chatroom,
    CHTYPE,
    CMETATYPE,
    CRSeen,
    ConversationCreateData,
    ConversationData,
    DMSG,
    LeaveCR,
    LeaveSC,
    Media,
    ParticipantsType,
    Profile,
    PushReportType,
    MarkRead,
    TAG,
    TaggingList,
    TaggingListOld,
    Upload,
    FollowChatroom,
    MuteChatroom,
    ShareChatroom,
    SetChatroom,
} from './types';

export class ChatroomData extends Base {
    getChatroom(chatroom: Chatroom): Promise<any> {
        return this.invoke(`${API.CHATROOM}?chatroom_id=${chatroom.chatroomId}`);
    }

    followChatroom(followChatroom: FollowChatroom): Promise<any> {
        return this.invoke(`${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            body: JSON.stringify(followChatroom),
        });
    }

    muteChatroom(muteChatroom: MuteChatroom): Promise<any> {
        return this.invoke(`${API.CHATROOM_MUTE}`, {
            method: 'PUT',
            body: JSON.stringify(muteChatroom),
        });
    }

    markRead(markRead: MarkRead): Promise<any> {
        return this.invoke(`${API.CHATROOM_MARK_READ}`, {
            method: 'POST',
            body: JSON.stringify(markRead),
        });
    }

    shareChatroomUrl(shareChatroom: ShareChatroom): Promise<any> {
        return this.invoke(`${API.CHATROOM_SHARED}?chatroom_id=${shareChatroom.chatroomId}&domain=${shareChatroom.domain}`);
    }

    setChatroomTopic(setChatroom: SetChatroom): Promise<any> {
        return this.invoke(`${API.CONVERSATION_TOPIC}`, {
            method: 'PUT',
            body: JSON.stringify(setChatroom),
        });
    }

    getTaggingList(taggingList: TaggingList): Promise<any> {
        if (taggingList.chatroomId) {
            if (taggingList.isSecret) {
                return this.invoke(
                    `${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.invoke(
                    `${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        } else {
            if (taggingList.isSecret) {
                return this.invoke(
                    `${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.invoke(
                    `${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        }
    }

    getTaggingListOld(taggingList: TaggingListOld): Promise<any> {
        return this.invoke(`${API.CHATROOM_GET_TAGGINNG_LIST}?chatroom_id=${taggingList.chatroom_id}`);
    }

    getReportTags(tag: TAG): Promise<any> {
        return this.invoke(`${API.FETCH_REPORT_TAGS}?type=${tag.type}`);
    }

    pushReport(pushReportType: PushReportType): Promise<any> {
        return this.invoke(`${API.PUSH_REPORT}`, {
            method: 'POST',
            body: JSON.stringify(pushReportType),
        });
    }

    onUploadFile(upload: Upload): Promise<any> {
        return this.invoke(`${API.UPLOAD_FILES}`, {
            method: 'POST',
            body: JSON.stringify(upload),
        });
    }

    onUploadFileAws(upload: Upload): Promise<any> {
        return this.invoke(`${API.HELPER_MEDIA_UPLOAD}`, {
            method: 'POST',
            body: JSON.stringify(upload),
        });
    }

    // leaveChatroom(leave: LeaveCR): Promise<any> {
    //     return this.invoke(
    //         `${API.COLLABCARD_FOLLOW}?collabcard_id=${leave.collabcard_id}&member_id=${leave.member_id}&value=${leave.value}`,
    //         {
    //             method: 'PUT',
    //             body: JSON.stringify({}),
    //         }
    //     );
    // }

    leaveSecretChatroom(leave: LeaveSC): Promise<any> {
        return this.invoke(`${API.CHATROOM_SECRET_LEAVE}`, {
            method: 'POST',
            body: JSON.stringify(leave),
        });
    }

    getConversations(conversationData: ConversationData): Promise<any> {
        if (conversationData.scroll_direction) {
            return this.invoke(
                `${API.CONVERSATION_FETCH}?chatroom_id=${conversationData.chatroomID}&paginate_by=${conversationData.page}&conversation_id=${conversationData.conversation_id}&scroll_direction=${conversationData.scroll_direction}`
            );
        } else if (conversationData.conversation_id) {
            return this.invoke(
                `${API.CONVERSATION_FETCH}?chatroom_id=${conversationData.chatroomID}&paginate_by=${conversationData.page}&conversation_id=${conversationData.conversation_id}&scroll_direction=${conversationData.scroll_direction}`
            );
        } else {
            return this.invoke(`${API.CONVERSATION_FETCH}?chatroom_id=${conversationData.chatroomID}&paginate_by=${conversationData.page}`);
        }
    }

    profileData(profile: Profile): Promise<any> {
        return this.invoke(`${API.MEMBER_STATE}?community_id=${profile.community_id}&member_id=${profile.member_id}`);
    }

    viewParticipants(participantsType: ParticipantsType): Promise<any> {
        if (participantsType.page) {
            return this.invoke(
                `${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroom_id}&is_secret=${participantsType.is_secret}&page=${participantsType.page}&page_size=${participantsType.page_size}`
            );
        } else {
            return this.invoke(
                `${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroom_id}&is_secret=${participantsType.is_secret}`
            );
        }
    }

    conversationsFetch(cmetaType: CMETATYPE): Promise<any> {
        if (cmetaType.chatroom_id) {
            return this.invoke(
                `${API.CONVERSATION_META}?chatroom_id=${cmetaType.chatroom_id}&conversation_id=${cmetaType.conversation_id}`
            );
        } else {
            return this.invoke(`${API.CONVERSATION_META}?conversation_id=${cmetaType.conversation_id}`);
        }
    }

    fetchChatroomHome(chatroom: CHTYPE): Promise<any> {
        return this.invoke(`${API.FETCH_CHATROOM_HOME}?chatroom_id=${chatroom.chatroom_id}`);
    }

    onConversationsCreate(newConversations: ConversationCreateData): Promise<any> {
        return this.invoke(`${API.CONVERSATION_CREATE}`, {
            method: 'POST',
            body: JSON.stringify(newConversations),
        });
    }

    addAction(action: Action): Promise<any> {
        return this.invoke(`${API.CONVERSATION_ADD_ACTION}`, {
            method: 'PUT',
            body: JSON.stringify(action),
        });
    }

    markReadFn(mr: Read): Promise<any> {
        return this.invoke(`${API.MARK_READ}`, {
            method: 'POST',
            body: JSON.stringify(mr),
        });
    }

    crSeenFn(mr: CRSeen): Promise<any> {
        return this.invoke(`${API.COLLABCARD_SEEN}`, {
            method: 'PUT',
            body: JSON.stringify(mr),
        });
    }

    deleteMsg(dMsg: DMSG): Promise<any> {
        return this.invoke(`${API.CONVERSATION_META}`, {
            method: 'DELETE',
            body: JSON.stringify(dMsg),
        });
    }

    // Upload Media Fn Start
    getAWS(): any {
        (AWS.config.region = 'ap-south-1'),
            (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                // Beta
                IdentityPoolId: 'ap-south-1:181963ba-f2db-450b-8199-964a941b38c2',

                // Prod
                // IdentityPoolId: 'ap-south-1:d73bc2ed-bede-42c8-bab7-0abe0a001325',
            }));
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            // params: { Bucket: 'prod-likeminds-media' },
            params: { Bucket: 'beta-likeminds-media' },
        });

        return s3;
    }

    uploadMedia(media: Media) {
        let mediaObject = this.getAWS().upload({
            Key: `files/collabcard/${media.chatroomId}/conversation/${media.messageId}/${media.file.name}`,
            // Bucket: 'prod-likeminds-media',
            Bucket: 'beta-likeminds-media',
            Body: media.file,
            ACL: 'public-read-write',
            ContentType: media.file.type,
        });
        return mediaObject.promise();
    }
    // Upload Media Fn End
}
