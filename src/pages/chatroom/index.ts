import * as AWS from 'aws-sdk';
import httpInst from 'src/core/services/base.service';
import { API } from '../../shared/constants/api.constant';
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
    LeaveSecretChatroom,
} from './types';
import NetworkLibrary from 'src/core/services/networklibrary';
import { Base } from 'src/base';

export class ChatroomData extends Base {
    public networkLibrary = new NetworkLibrary();
    getChatroom(chatroom: Chatroom): Promise<any> {
        console.log('chatroom data=> ', chatroom);
        return this.networkLibrary.get(`${API.CHATROOM}?chatroom_id=${chatroom.chatroomId}`).then((resData: any) => {
            return resData.data;
        });
    }

    followChatroom(followChatroom: FollowChatroom): Promise<any> {
        const params = {
            collabcard_id: followChatroom.collabcardId,
            member_id: followChatroom.memberId,
            value: followChatroom.value,
        };
        return this.networkLibrary.put(`${API.CHATROOM_FOLLOW}`, params);
    }

    muteChatroom(muteChatroom: MuteChatroom): Promise<any> {
        const params = {
            chatroom_id: muteChatroom.chatroomId,
            value: muteChatroom.value,
        };
        return this.networkLibrary.put(`${API.CHATROOM_MUTE}`, params);
    }

    markReadChatroom(markRead: MarkRead): Promise<any> {
        return this.networkLibrary.post(`${API.CHATROOM_MARK_READ}`, {
            chatroom_id: markRead.chatroomId,
        });
    }

    shareChatroomUrl(shareChatroom: ShareChatroom): Promise<any> {
        return this.networkLibrary.get(`${API.CHATROOM_SHARED}?chatroom_id=${shareChatroom.chatroomId}&domain=${shareChatroom.domain}`);
    }

    setChatroomTopic(setChatroom: SetChatroom): Promise<any> {
        const params = {
            chatroom_id: setChatroom.chatroomId,
            conversation_id: setChatroom.conversationId,
        };
        return this.networkLibrary.put(`${API.CONVERSATION_TOPIC}`, params);
    }

    getTaggingList(taggingList: TaggingList): Promise<any> {
        if (taggingList.chatroomId) {
            if (taggingList.isSecret) {
                return this.networkLibrary.get(
                    `${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.get(
                    `${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        } else {
            if (taggingList.isSecret) {
                return this.networkLibrary.get(
                    `${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.get(
                    `${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        }
    }

    getConversation(conversation: Conversation): Promise<any> {
        if (conversation.scrollDirection) {
            return this.networkLibrary.get(
                `${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else if (conversation.conversationID) {
            return this.networkLibrary.get(
                `${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else {
            return this.networkLibrary.get(
                `${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}`
            );
        }
    }

    postConversation(postConversation: PostConversation): Promise<any> {
        const params = {
            chatroom_id: postConversation.chatroomId,
            temporary_id: postConversation.temporaryId,
            text: postConversation.text,
            has_files: postConversation.hasFiles,
            attachment_count: postConversation.attachmentCount,
            replied_conversation_id: postConversation.repliedConversationId,
            share_link: postConversation.shareLink,
            og_tags: postConversation.ogTags,
        };
        return this.networkLibrary.post(`${API.CONVERSATION}`, params);
    }

    editConversation(conversationId: EditConversation): Promise<any> {
        const params = {
            conversation_id: conversationId.conversationId,
            text: conversationId.text,
            share_link: conversationId.shareLink,
            og_tags: conversationId.ogTags,
        };
        return this.networkLibrary.put(`${API.CONVERSATION}`, params);
    }

    deleteConversation(deleteConversation: DeleteConversation): Promise<any> {
        const params = {
            conversation_ids: deleteConversation.conversationIds,
            reason: deleteConversation.reason,
        };
        return this.networkLibrary.delete(`${API.CONVERSATION}`, { data: params });
    }

    putReaction(putReaction: PutReaction): Promise<any> {
        const params = {
            chatroom_id: putReaction.chatroomId,
            conversation_id: putReaction.conversationId,
            reaction: putReaction.reaction,
        };
        return this.networkLibrary.put(`${API.CONVERSATION_REACTION}`, params);
    }

    deleteReaction(deleteReaction: DeleteReaction): Promise<any> {
        const params = {
            chatroom_id: deleteReaction.chatroomId,
            conversation_id: deleteReaction.conversationId,
            reaction: deleteReaction.reaction,
        };
        return this.networkLibrary.delete(`${API.CONVERSATION_REACTION}`, { data: params });
    }

    // Upload Media Fn Start
    getAWS(): any {
        (AWS.config.region = 'ap-south-1'),
            (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                // // Beta
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
        const params = {
            conversation_id: putMultimedia.conversationId,
            url: putMultimedia.url,
            type: putMultimedia.type,
            files_count: putMultimedia.filesCount,
            index: putMultimedia.index,
            height: putMultimedia.height,
            width: putMultimedia.width,
            meta: putMultimedia.meta,
            name: putMultimedia.name,
            thumbnail_url: putMultimedia.thumbnailUrl,
        };
        return this.networkLibrary.post(`${API.HELPER_MEDIA_UPLOAD}`, params);
    }

    // Upload Media Function End

    decodeUrl(decodeUrl: DecodeUrl): Promise<any> {
        return this.networkLibrary.get(`${API.HELPER_URL}?url=${decodeUrl.url}`);
    }

    // Polls need to update
    postPollConversation(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.get(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    getPollUsers(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.get(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    addPollOption(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.get(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }
    submitPoll(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.get(`${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`);
    }

    getReportTags(getReportTags: GetReportTags): Promise<any> {
        return this.networkLibrary.get(`${API.FETCH_REPORT_TAGS}?type=${getReportTags.type}`);
    }

    pushReport(pushReport: PushReport): Promise<any> {
        const params = {
            conversation_id: pushReport.conversationId,
            tag_id: pushReport.tagId,
            reason: pushReport.reason,
            reported_member_id: pushReport.reportedMemberId,
        };
        return this.networkLibrary.post(`${API.PUSH_REPORT}`, params);
    }

    leaveSecretChatroom(leaveSecretChatroom: LeaveSecretChatroom): Promise<any> {
        const params = {
            chatroom_id: leaveSecretChatroom.chatroomId,
            member_id: leaveSecretChatroom.memberId,
        };
        return this.networkLibrary.delete(`${API.CHATROOM_PARTICIPANTS}`, { data: params });
    }

    // ******************************

    profileData(profile: Profile): Promise<any> {
        return this.networkLibrary.get(`${API.COMMUNITY_MEMBER_STATE}?community_id=${profile.community_id}&member_id=${profile.member_id}`);
    }

    viewParticipants(participantsType: ParticipantsType): Promise<any> {
        if (participantsType.page) {
            return this.networkLibrary.get(
                `${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroom_id}&is_secret=${participantsType.is_secret}&page=${participantsType.page}&page_size=${participantsType.page_size}`
            );
        } else {
            return this.networkLibrary.get(
                `${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroom_id}&is_secret=${participantsType.is_secret}`
            );
        }
    }

    conversationsFetch(cmetaType: CMETATYPE): Promise<any> {
        if (cmetaType.chatroom_id) {
            return this.networkLibrary.get(
                `${API.CONVERSATION_META}?chatroom_id=${cmetaType.chatroom_id}&conversation_id=${cmetaType.conversation_id}`
            );
        } else {
            return this.networkLibrary.get(`${API.CONVERSATION_META}?conversation_id=${cmetaType.conversation_id}`);
        }
    }

    fetchChatroomHome(chatroom: CHTYPE): Promise<any> {
        return this.networkLibrary.get(`${API.FETCH_CHATROOM_HOME}?chatroom_id=${chatroom.chatroom_id}`);
    }

    crSeenFn(crSeen: CRSeen): Promise<any> {
        const params = {
            collabcard_id: crSeen.collabcardId,
            member_id: crSeen.memberId,
            collabcard_type: crSeen.collabcardType,
        };
        return this.networkLibrary.put(`${API.COLLABCARD_SEEN}`, params);
    }
}
