import * as AWS from 'aws-sdk';
import { API } from '../../shared/constants/api.constant';
import {
    Chatroom,
    CHTYPE,
    CRSeen,
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
    ChatroomSeen,
    CmetaType,
} from './types';
import { Base } from 'src/base';
import { environment } from 'src/environment';
import NetworkLibrary from 'src/core/services/networklibrary';

// Chatroom.ts
export class ChatroomData extends Base {
    public networkLibrary = new NetworkLibrary();
    getChatroom(chatroom: Chatroom): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM}?chatroom_id=${chatroom.chatroomId}`);
    }

    followChatroom(followChatroom: FollowChatroom): Promise<any> {
        const params = {
            collabcard_id: followChatroom.collabcardId,
            member_id: followChatroom.memberId,
            value: followChatroom.value,
        };

        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            data: params,
        });
    }

    muteChatroom(muteChatroom: MuteChatroom): Promise<any> {
        const params = {
            chatroom_id: muteChatroom.chatroomId,
            value: muteChatroom.value,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_MUTE}`, {
            method: 'PUT',
            data: params,
        });
    }

    markReadChatroom(markRead: MarkRead): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_MARK_READ}`, {
            method: 'POST',
            data: {
                chatroom_id: markRead.chatroomId,
            },
        });
    }

    shareChatroomUrl(shareChatroom: ShareChatroom): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHATROOM_SHARED}?chatroom_id=${shareChatroom.chatroomId}&domain=${shareChatroom.domain}`
        );
    }

    setChatroomTopic(setChatroom: SetChatroom): Promise<any> {
        const params = {
            chatroom_id: setChatroom.chatroomId,
            conversation_id: setChatroom.conversationId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION_TOPIC}`, {
            method: 'PUT',
            data: params,
        });
    }

    getTaggingList(taggingList: TaggingList): Promise<any> {
        if (taggingList.chatroomId) {
            if (taggingList.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        } else {
            if (taggingList.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        }
    }

    getConversation(conversation: Conversation): Promise<any> {
        if (conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID && !conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else if (conversation.temporaryID) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&temporary_id=${conversation.temporaryID}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}`
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
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'POST',
            data: params,
        });
    }

    editConversation(conversationId: EditConversation): Promise<any> {
        const params = {
            conversation_id: conversationId.conversationId,
            text: conversationId.text,
            share_link: conversationId.shareLink,
            og_tags: conversationId.ogTags,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteConversation(deleteConversation: DeleteConversation): Promise<any> {
        const params = {
            conversation_ids: deleteConversation.conversationIds,
            reason: deleteConversation.reason,
        };

        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    putReaction(putReaction: PutReaction): Promise<any> {
        const params = {
            chatroom_id: putReaction.chatroomId,
            conversation_id: putReaction.conversationId,
            reaction: putReaction.reaction,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteReaction(deleteReaction: DeleteReaction): Promise<any> {
        const params = {
            chatroom_id: deleteReaction.chatroomId,
            conversation_id: deleteReaction.conversationId,
            reaction: deleteReaction.reaction,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    // Upload Media Fn Start
    getAWS(): any {
        (AWS.config.region = 'ap-south-1'),
            (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: environment.awsConfig.poolId,
            }));
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: environment.awsConfig.bucket },
        });

        return s3;
    }

    uploadMedia(media: Media) {
        let mediaObject = this.getAWS().upload({
            Key: `files/collabcard/${media.chatroomId}/conversation/${media.messageId}/${media.file.name}`,
            Bucket: environment.awsConfig.bucket,
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
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.HELPER_MEDIA_UPLOAD}`, {
            method: 'POST',
            data: params,
        });
    }

    // Upload Media Function End

    decodeUrl(decodeUrl: DecodeUrl): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.HELPER_URL}?url=${decodeUrl.url}`);
    }

    // Polls need to update
    postPollConversation(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`
        );
    }
    getPollUsers(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`
        );
    }
    addPollOption(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`
        );
    }
    submitPoll(postPollConversation: PostPollConversation): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${postPollConversation.chatroomId}`
        );
    }

    getReportTags(getReportTags: GetReportTags): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.FETCH_REPORT_TAGS}?type=${getReportTags.type}`);
    }

    pushReport(pushReport: PushReport): Promise<any> {
        const params = {
            conversation_id: pushReport?.conversationId,
            tag_id: pushReport.tagId,
            reason: pushReport.reason,
            reported_member_id: pushReport?.reportedMemberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.PUSH_REPORT}`, {
            method: 'POST',
            data: params,
        });
    }

    leaveSecretChatroom(leaveSecretChatroom: LeaveSecretChatroom): Promise<any> {
        const params = {
            chatroom_id: leaveSecretChatroom.chatroomId,
            member_id: leaveSecretChatroom.memberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}`, {
            method: 'DELETE',
            data: params,
        });
    }

    // ******************************

    profileData(profile: Profile): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_STATE}?community_id=${profile.community_id}&member_id=${profile.member_id}`
        );
    }

    viewParticipants(participantsType: ParticipantsType): Promise<any> {
        if (participantsType.participantName) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}&participant_name=${participantsType.participantName}`
            );
        } else if (participantsType.page) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}`
            );
        }
    }

    conversationsFetch(cmetaType: CmetaType): Promise<any> {
        if (cmetaType.chatroomId) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION_META}?chatroom_id=${cmetaType.chatroomId}&conversation_id=${cmetaType.conversationId}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.CONVERSATION_META}?conversation_id=${cmetaType.conversationId}`
            );
        }
    }

    fetchChatroomHome(chatroom: CHTYPE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.FETCH_CHATROOM_HOME}?chatroom_id=${chatroom.chatroom_id}`
        );
    }

    crSeenFn(crSeen: CRSeen): Promise<any> {
        const params = {
            collabcard_id: crSeen.collabcardId,
            member_id: crSeen.memberId,
            collabcard_type: crSeen.collabcardType,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COLLABCARD_SEEN}`, {
            method: 'PUT',
            data: params,
        });
    }

    chatroomSeen(chatroomSeen: ChatroomSeen): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COLLABCARD_SEEN}?collabcard_id=${chatroomSeen.collabcardId}&member_id=${chatroomSeen.memberId}&collabcard_type=${chatroomSeen.collabcardType}`,
            {
                method: 'PUT',
                data: {},
            }
        );
    }
}
