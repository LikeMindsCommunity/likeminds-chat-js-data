import * as AWS from 'aws-sdk';
import { Base } from '../base';
import { API } from '../shared/api.constant';
import {
    Chatroom,
    CHTYPE,
    CMETATYPE,
    CRSeen,
    LeaveSC,
    Media,
    ParticipantsType,
    Profile,
    MarkRead,
    TaggingList,
    FollowChatroom,
    MuteChatroom,
    ShareChatroom,
    SetChatroom,
    Conversation,
    PostConversation,
    EditConversation,
    DeleteConversation,
    PutReaction,
    DeleteReaction,
    PutMultimedia,
    DecodeUrl,
    PostPollConversation,
    GetReportTags,
    PushReport,
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

    markReadChatroom(markRead: MarkRead): Promise<any> {
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

    getConversation(conversation: Conversation): Promise<any> {
        if (conversation.scrollDirection) {
            return this.invoke(
                `${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else if (conversation.conversationID) {
            return this.invoke(
                `${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else {
            return this.invoke(`${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}`);
        }
    }

    postConversation(postConversation: PostConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}`, {
            method: 'POST',
            body: JSON.stringify(postConversation),
        });
    }

    editConversation(editConversation: EditConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}`, {
            method: 'PUT',
            body: JSON.stringify(editConversation),
        });
    }

    deleteConversation(deleteConversation: DeleteConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}`, {
            method: 'DELETE',
            body: JSON.stringify(deleteConversation),
        });
    }

    putReaction(putReaction: PutReaction): Promise<any> {
        return this.invoke(`${API.CONVERSATION_REACTION}`, {
            method: 'PUT',
            body: JSON.stringify(putReaction),
        });
    }

    deleteReaction(deleteReaction: DeleteReaction): Promise<any> {
        return this.invoke(`${API.CONVERSATION_REACTION}`, {
            method: 'DELETE',
            body: JSON.stringify(deleteReaction),
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

    putMultimedia(putMultimedia: PutMultimedia): Promise<any> {
        return this.invoke(`${API.HELPER_MEDIA_UPLOAD}`, {
            method: 'POST',
            body: JSON.stringify(putMultimedia),
        });
    }

    // Upload Media Function End

    decodeUrl(decodeUrl: DecodeUrl): Promise<any> {
        return this.invoke(`${API.HELPER_URL}?url=${decodeUrl.url}`);
    }

    // Polls need to update
    postPollConversation(postPollConversation: PostPollConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    getPollUsers(postPollConversation: PostPollConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    addPollOption(postPollConversation: PostPollConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    submitPoll(postPollConversation: PostPollConversation): Promise<any> {
        return this.invoke(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }

    getReportTags(getReportTags: GetReportTags): Promise<any> {
        return this.invoke(`${API.FETCH_REPORT_TAGS}?type=${getReportTags.type}`);
    }

    pushReport(pushReport: PushReport): Promise<any> {
        return this.invoke(`${API.PUSH_REPORT}`, {
            method: 'POST',
            body: JSON.stringify(pushReport),
        });
    }

    // ******************************

    leaveSecretChatroom(leave: LeaveSC): Promise<any> {
        return this.invoke(`${API.CHATROOM_SECRET_LEAVE}`, {
            method: 'POST',
            body: JSON.stringify(leave),
        });
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

    crSeenFn(mr: CRSeen): Promise<any> {
        return this.invoke(`${API.COLLABCARD_SEEN}`, {
            method: 'PUT',
            body: JSON.stringify(mr),
        });
    }
}
