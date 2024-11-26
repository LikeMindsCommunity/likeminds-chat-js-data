/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as AWS from 'aws-sdk';
import { API } from '../../shared/constants/api.constant';
import {
    GetChatroomRequest,
    CHTYPE,
    CRSeen,
    Media,
    ViewParticipantsRequest,
    Profile,
    MarkReadRequest,
    GetTaggingListRequest,
    FollowChatroomRequest,
    MuteChatroomRequest,
    ShareChatroomRequest,
    SetChatroomRequest,
    Conversation,
    PostConversationRequest,
    EditConversationRequest,
    DeleteConversationRequest,
    PutReactionRequest,
    DeleteReactionRequest,
    PutMultimedia,
    GetDecodeUrlRequest,
    PostPollConversationRequest,
    GetReportTagsRequest,
    PushReportRequest,
    LeaveSecretChatroomRequest,
    ChatroomSeen,
    CmetaType,
    FollowChatroomWithUuidRequest,
    ChatroomSeenWithUuid,
    GetConversationsRequest,
    GetParticipantsRequest,
    GetAIChatbotsRequest,
} from './types';
import { Base } from 'src/base';
import { environment } from 'src/environment';
import NetworkLibrary from 'src/core/services/networklibrary';
import { Nothing } from 'src/shared/responseModels/Nothing';
import LMResponse from 'src/core/services/lmresponse';
import { ModelConverter } from 'src/utils/ModelConverter';
import { GetChatroom } from '../../shared/api-responses/getChatroomResponse';

import { GetTaggingList } from '../../shared/api-responses/getTaggingListResponse';
import { GetConversation } from '../../shared/api-responses/getSyncConversationsResponse';
import { PostConversation } from '../../shared/api-responses/postConversationResponse';
import { DeleteConversation } from '../../shared/api-responses/DeleteConversation';
import { EditConversation } from '../../shared/api-responses/EditConversation';
import { GetOgTag } from '../../shared/api-responses/getOgTagResponse';
import { GetReportConverationTags } from '../../shared/api-responses/getReportTagsResponseChatResponse';
import { ViewParticipants } from '../../shared/api-responses/viewParticipants';
import { GetAIChatbotsResponse } from '../../shared/api-responses/GetAIChatbotsResponse';

// Chatroom.ts
export class ChatroomData extends Base {
    // public networkLibrary = new NetworkLibrary();
    getChatroom(chatroom: GetChatroomRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<GetChatroom>(
            `${environment.apiUrl}${API.CHATROOM}?chatroom_id=${chatroom.chatroomId}`
        );
    }

    followChatroom(followChatroom: FollowChatroomRequest) {
        const params = {
            collabcard_id: followChatroom.collabcardId,
            member_id: followChatroom.memberId,
            value: followChatroom.value,
        };

        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            data: params,
        });
    }

    followChatroomWithUuid(followChatroom: FollowChatroomWithUuidRequest) {
        const params = {
            collabcard_id: followChatroom.collabcardId,
            uuid: followChatroom.uuid,
            value: followChatroom.value,
        };

        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            data: params,
        });
    }

    muteChatroom(muteChatroom: MuteChatroomRequest): Promise<any> {
        const params = {
            chatroom_id: muteChatroom.chatroomId,
            value: muteChatroom.value,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_MUTE}`, {
            method: 'PUT',
            data: params,
        });
    }

    markReadChatroom(markRead: MarkReadRequest): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_MARK_READ}`, {
            method: 'POST',
            data: {
                chatroom_id: markRead.chatroomId,
            },
        });
    }

    shareChatroomUrl(shareChatroom: ShareChatroomRequest): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHATROOM_SHARED}?chatroom_id=${shareChatroom.chatroomId}&domain=${shareChatroom.domain}`
        );
    }

    setChatroomTopic(setChatroom: SetChatroomRequest): Promise<any> {
        const params = {
            chatroom_id: setChatroom.chatroomId,
            conversation_id: setChatroom.conversationId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION_TOPIC}`, {
            method: 'PUT',
            data: params,
        });
    }

    getTaggingList(taggingList: GetTaggingListRequest) {
        if (taggingList.chatroomId) {
            if (taggingList.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingList>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingList>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${taggingList.chatroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        } else {
            if (taggingList.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingList>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}&is_secret=${taggingList.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingList>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${taggingList.feedroomId}&search_name=${taggingList.searchName}&page=${taggingList.page}&page_size=${taggingList.pageSize}`
                );
            }
        }
    }

    // Depriciated method. Use getConversations instead.
    getConversation(conversation: Conversation) {
        if (conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID && !conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID) {
            return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else if (conversation.temporaryID) {
            return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&temporary_id=${conversation.temporaryID}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}`
            );
        }
    }

    getConversations(getConversationsRequest: GetConversationsRequest): Promise<any> {
        const excludeConversations = this.networkLibrary.getExcludedConversationStates();

        if (excludeConversations.length > 0) {
            if (getConversationsRequest.conversationId) {
                return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&conversation_id=${getConversationsRequest.conversationId}&excluded_conversation_states=[${excludeConversations}]`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&excluded_conversation_states=[${excludeConversations}]`
                );
            }
        } else {
            if (getConversationsRequest.conversationId) {
                return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&conversation_id=${getConversationsRequest.conversationId}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetConversation>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}`
                );
            }
        }
    }

    postConversation(postConversation: PostConversationRequest) {
        const params: Record<string, any> = {
            chatroom_id: postConversation.chatroomId,
            temporary_id: postConversation.temporaryId,
            text: postConversation.text,
            has_files: postConversation.hasFiles,
            replied_conversation_id: postConversation.repliedConversationId,
            share_link: postConversation.shareLink,
            og_tags: postConversation.ogTags,
            attachments: postConversation.attachments,
            trigger_bot: postConversation.triggerBot,
        };
        if (postConversation.metadata) {
            params.metadata = postConversation.metadata;
        }
        return this.networkLibrary.makeAuthenticatedRequest<PostConversation>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'POST',
            data: params,
        });
    }

    editConversation(conversationId: EditConversationRequest) {
        const params = {
            conversation_id: conversationId.conversationId,
            text: conversationId.text,
            share_link: conversationId.shareLink,
            og_tags: conversationId.ogTags,
        };
        return this.networkLibrary.makeAuthenticatedRequest<EditConversation>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteConversation(deleteConversation: DeleteConversationRequest) {
        const params = {
            conversation_ids: deleteConversation.conversationIds,
            reason: deleteConversation.reason,
        };

        return this.networkLibrary.makeAuthenticatedRequest<DeleteConversation>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    putReaction(putReaction: PutReactionRequest) {
        let params;
        if (putReaction.chatroomId) {
            params = {
                chatroom_id: putReaction?.chatroomId,
                conversation_id: putReaction.conversationId,
                reaction: putReaction.reaction,
            };
        } else {
            params = {
                conversation_id: putReaction.conversationId,
                reaction: putReaction.reaction,
            };
        }
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteReaction(deleteReaction: DeleteReactionRequest) {
        const params = {
            chatroom_id: deleteReaction.chatroomId,
            conversation_id: deleteReaction.conversationId,
            reaction: deleteReaction.reaction,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    decodeUrl(decodeUrl: GetDecodeUrlRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<GetOgTag>(`${environment.apiUrl}${API.HELPER_URL}?url=${decodeUrl.url}`);
    }

    getReportTags(getReportTags: GetReportTagsRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<GetReportConverationTags>(
            `${environment.apiUrl}${API.FETCH_REPORT_TAGS}?type=${getReportTags.type}`
        );
    }

    pushReport(pushReport: PushReportRequest) {
        const params = {
            conversation_id: pushReport?.conversationId,
            tag_id: pushReport.tagId,
            reason: pushReport.reason,
            reported_member_id: pushReport?.reportedMemberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.PUSH_REPORT}`, {
            method: 'POST',
            data: params,
        });
    }

    leaveSecretChatroom(leaveSecretChatroom: LeaveSecretChatroomRequest): Promise<any> {
        const params = {
            chatroom_id: leaveSecretChatroom.chatroomId,
            is_secret: leaveSecretChatroom?.isSecret,
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

    viewParticipants(participantsType: ViewParticipantsRequest) {
        if (participantsType.participantName) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}&participant_name=${participantsType.participantName}`
            );
        } else if (participantsType.page) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomId}&is_secret=${participantsType.isSecret}`
            );
        }
    }
    getParticipants(participantsType: GetParticipantsRequest) {
        if (participantsType.searchKey) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}&search_key=${participantsType.searchKey}`
            );
        } else if (participantsType.page) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipants>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}`
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

    chatroomSeenWithUuid(chatroomSeen: ChatroomSeenWithUuid) {
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(
            `${environment.apiUrl}${API.COLLABCARD_SEEN}?collabcard_id=${chatroomSeen.collabcardId}&uuid=${chatroomSeen.uuid}&collabcard_type=${chatroomSeen.collabcardType}`,
            {
                method: 'PUT',
                data: {},
            }
        );
    }

    getAIChatbots(getAIChatbotsRequest: GetAIChatbotsRequest): Promise<LMResponse<GetAIChatbotsResponse>> {
        const { page, pageSize = 10 } = getAIChatbotsRequest;
        return this.networkLibrary.makeAuthenticatedRequest<GetAIChatbotsResponse>(
            `${environment.apiUrl}${API.COMMUNITY_CHATBOT}?page=${page}&page_size=${pageSize}`,
            {
                method: 'GET',
            }
        );
    }
}
