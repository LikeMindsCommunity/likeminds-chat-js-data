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
import { ModelConverter } from 'src/utils/ModelConverter';
import { GetChatroomResponse } from '../../shared/api-responses/getChatroomResponse';

import { GetTaggingListResponse } from '../../shared/api-responses/getTaggingListResponse';
import { SyncConversationResponse } from '../../shared/api-responses/getSyncConversationsResponse';
import { PostConversationResponse } from '../../shared/api-responses/postConversationResponse';
import { DeleteConversationResponse } from '../../shared/api-responses/DeleteConversation';
import { EditConversationResponse } from '../../shared/api-responses/EditConversation';
import { DecodeURLResponse } from '../../shared/api-responses/getOgTagResponse';
import { ViewParticipantsResponse } from '../../shared/api-responses/viewParticipants';
import { GetAIChatbotsResponse } from '../../shared/api-responses/GetAIChatbotsResponse';
import LMResponse from '../../core/services/lmresponse';
import { GetReportTagsResponse } from '../../shared/api-responses/getReportTagsResponse';

// Chatroom.ts
export class ChatroomData extends Base {
    getChatroom(getChatroomRequest: GetChatroomRequest): Promise<LMResponse<GetChatroomResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<GetChatroomResponse>(
            `${environment.apiUrl}${API.CHATROOM}?chatroom_id=${getChatroomRequest.chatroomId}`
        );
    }

    followChatroom(followChatroomRequest: FollowChatroomRequest): Promise<LMResponse<Nothing>> {
        const params = {
            collabcard_id: followChatroomRequest.collabcardId,
            member_id: followChatroomRequest.memberId,
            value: followChatroomRequest.value,
        };

        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            data: params,
        });
    }

    followChatroomWithUuid(followChatroomRequest: FollowChatroomWithUuidRequest): Promise<LMResponse<Nothing>> {
        const params = {
            collabcard_id: followChatroomRequest.collabcardId,
            uuid: followChatroomRequest.uuid,
            value: followChatroomRequest.value,
        };

        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_FOLLOW}`, {
            method: 'PUT',
            data: params,
        });
    }

    muteChatroom(muteChatroomRequest: MuteChatroomRequest): Promise<LMResponse<Nothing>> {
        const params = {
            chatroom_id: muteChatroomRequest.chatroomId,
            value: muteChatroomRequest.value,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_MUTE}`, {
            method: 'PUT',
            data: params,
        });
    }

    markReadChatroom(markReadRequest: MarkReadRequest): Promise<LMResponse<Nothing>> {
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CHATROOM_MARK_READ}`, {
            method: 'POST',
            data: {
                chatroom_id: markReadRequest.chatroomId,
            },
        });
    }

    shareChatroomUrl(shareChatroomRequest: ShareChatroomRequest) {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHATROOM_SHARED}?chatroom_id=${shareChatroomRequest.chatroomId}&domain=${shareChatroomRequest.domain}`
        );
    }

    setChatroomTopic(setChatroomRequest: SetChatroomRequest) {
        const params = {
            chatroom_id: setChatroomRequest.chatroomId,
            conversation_id: setChatroomRequest.conversationId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CONVERSATION_TOPIC}`, {
            method: 'PUT',
            data: params,
        });
    }

    getTaggingList(getTaggingListRequest: GetTaggingListRequest): Promise<LMResponse<GetTaggingListResponse>> {
        if (getTaggingListRequest.chatroomId) {
            if (getTaggingListRequest.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingListResponse>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${getTaggingListRequest.chatroomId}&search_name=${getTaggingListRequest.searchName}&page=${getTaggingListRequest.page}&page_size=${getTaggingListRequest.pageSize}&is_secret=${getTaggingListRequest.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingListResponse>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?chatroom_id=${getTaggingListRequest.chatroomId}&search_name=${getTaggingListRequest.searchName}&page=${getTaggingListRequest.page}&page_size=${getTaggingListRequest.pageSize}`
                );
            }
        } else {
            if (getTaggingListRequest.isSecret) {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingListResponse>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${getTaggingListRequest.feedroomId}&search_name=${getTaggingListRequest.searchName}&page=${getTaggingListRequest.page}&page_size=${getTaggingListRequest.pageSize}&is_secret=${getTaggingListRequest.isSecret}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<GetTaggingListResponse>(
                    `${environment.apiUrl}${API.COMMUNITY_TAG}?feedroom_id=${getTaggingListRequest.feedroomId}&search_name=${getTaggingListRequest.searchName}&page=${getTaggingListRequest.page}&page_size=${getTaggingListRequest.pageSize}`
                );
            }
        }
    }

    /**
     * @deprecated Use the new {@link getConversations} method instead.
     */
    getConversation(conversation: Conversation) {
        if (conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID && !conversation.scrollDirection) {
            return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&include=${conversation.include}`
            );
        } else if (conversation.conversationID) {
            return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}`
            );
        } else if (conversation.temporaryID) {
            return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}&conversation_id=${conversation.conversationID}&scroll_direction=${conversation.scrollDirection}&temporary_id=${conversation.temporaryID}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                `${environment.apiUrl}${API.CONVERSATION}?chatroom_id=${conversation.chatroomID}&paginate_by=${conversation.paginateBy}`
            );
        }
    }

    getConversations(getConversationsRequest: GetConversationsRequest): Promise<LMResponse<SyncConversationResponse>> {
        const excludeConversations = this.networkLibrary.getExcludedConversationStates();

        if (excludeConversations.length > 0) {
            if (getConversationsRequest.conversationId) {
                return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&conversation_id=${getConversationsRequest.conversationId}&excluded_conversation_states=[${excludeConversations}]`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&excluded_conversation_states=[${excludeConversations}]`
                );
            }
        } else {
            if (getConversationsRequest.conversationId) {
                return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}&conversation_id=${getConversationsRequest.conversationId}`
                );
            } else {
                return this.networkLibrary.makeAuthenticatedRequest<SyncConversationResponse>(
                    `${environment.apiUrl}${API.CONVERSATION_SYNC}?page=${getConversationsRequest.page}&page_size=${getConversationsRequest.pageSize}&chatroom_id=${getConversationsRequest.chatroomId}&max_timestamp=${getConversationsRequest.maxTimestamp}&min_timestamp=${getConversationsRequest.minTimestamp}&is_local_db=${getConversationsRequest.isLocalDb}`
                );
            }
        }
    }

    postConversation(postConversationRequest: PostConversationRequest): Promise<LMResponse<PostConversationResponse>> {
        const params: Record<string, any> = {
            chatroom_id: postConversationRequest.chatroomId,
            temporary_id: postConversationRequest.temporaryId,
            text: postConversationRequest.text,
            has_files: postConversationRequest.hasFiles,
            replied_conversation_id: postConversationRequest.repliedConversationId,
            share_link: postConversationRequest.shareLink,
            og_tags: postConversationRequest.ogTags,
            attachments: postConversationRequest.attachments,
            trigger_bot: postConversationRequest.triggerBot,
        };
        if (postConversationRequest.metadata) {
            params.metadata = postConversationRequest.metadata;
        }
        return this.networkLibrary.makeAuthenticatedRequest<PostConversationResponse>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'POST',
            data: params,
        });
    }

    editConversation(editConversationRequest: EditConversationRequest): Promise<LMResponse<EditConversationResponse>> {
        const params = {
            conversation_id: editConversationRequest.conversationId,
            text: editConversationRequest.text,
            share_link: editConversationRequest.shareLink,
            og_tags: editConversationRequest.ogTags,
        };
        return this.networkLibrary.makeAuthenticatedRequest<EditConversationResponse>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteConversation(deleteConversationRequest: DeleteConversationRequest): Promise<LMResponse<DeleteConversationResponse>> {
        const params = {
            conversation_ids: deleteConversationRequest.conversationIds,
            reason: deleteConversationRequest.reason,
        };

        return this.networkLibrary.makeAuthenticatedRequest<DeleteConversationResponse>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    putReaction(putReactionRequest: PutReactionRequest): Promise<LMResponse<Nothing>> {
        let params;
        if (putReactionRequest.chatroomId) {
            params = {
                chatroom_id: putReactionRequest?.chatroomId,
                conversation_id: putReactionRequest.conversationId,
                reaction: putReactionRequest.reaction,
            };
        } else {
            params = {
                conversation_id: putReactionRequest.conversationId,
                reaction: putReactionRequest.reaction,
            };
        }
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'PUT',
            data: params,
        });
    }

    deleteReaction(deleteReactionRequest: DeleteReactionRequest): Promise<LMResponse<Nothing>> {
        const params = {
            chatroom_id: deleteReactionRequest.chatroomId,
            conversation_id: deleteReactionRequest.conversationId,
            reaction: deleteReactionRequest.reaction,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CONVERSATION_REACTION}`, {
            method: 'DELETE',
            data: params,
        });
    }

    decodeUrl(decodeUrlRequest: GetDecodeUrlRequest): Promise<LMResponse<DecodeURLResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<DecodeURLResponse>(
            `${environment.apiUrl}${API.HELPER_URL}?url=${decodeUrlRequest.url}`
        );
    }

    getReportTags(getReportTagsRequest: GetReportTagsRequest): Promise<LMResponse<GetReportTagsResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<GetReportTagsResponse>(
            `${environment.apiUrl}${API.FETCH_REPORT_TAGS}?type=${getReportTagsRequest.type}`
        );
    }

    pushReport(pushReportRequest: PushReportRequest): Promise<LMResponse<Nothing>> {
        const params = {
            conversation_id: pushReportRequest?.conversationId,
            tag_id: pushReportRequest.tagId,
            reason: pushReportRequest.reason,
            reported_member_id: pushReportRequest?.reportedMemberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.PUSH_REPORT}`, {
            method: 'POST',
            data: params,
        });
    }

    leaveSecretChatroom(leaveSecretChatroomRequest: LeaveSecretChatroomRequest) {
        const params = {
            chatroom_id: leaveSecretChatroomRequest.chatroomId,
            is_secret: leaveSecretChatroomRequest?.isSecret,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}`, {
            method: 'DELETE',
            data: params,
        });
    }

    profileData(profile: Profile) {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_STATE}?community_id=${profile.community_id}&member_id=${profile.member_id}`
        );
    }

    viewParticipants(viewParticipantsRequest: ViewParticipantsRequest): Promise<LMResponse<ViewParticipantsResponse>> {
        if (viewParticipantsRequest.participantName) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${viewParticipantsRequest.chatroomId}&is_secret=${viewParticipantsRequest.isSecret}&page=${viewParticipantsRequest.page}&page_size=${viewParticipantsRequest.pageSize}&participant_name=${viewParticipantsRequest.participantName}`
            );
        } else if (viewParticipantsRequest.page) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${viewParticipantsRequest.chatroomId}&is_secret=${viewParticipantsRequest.isSecret}&page=${viewParticipantsRequest.page}&page_size=${viewParticipantsRequest.pageSize}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${viewParticipantsRequest.chatroomId}&is_secret=${viewParticipantsRequest.isSecret}`
            );
        }
    }
    getParticipants(participantsType: GetParticipantsRequest): Promise<LMResponse<ViewParticipantsResponse>> {
        if (participantsType.searchKey) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}&search_key=${participantsType.searchKey}`
            );
        } else if (participantsType.page) {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}&page=${participantsType.page}&page_size=${participantsType.pageSize}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<ViewParticipantsResponse>(
                `${environment.apiUrl}${API.CHATROOM_PARTICIPANTS}?chatroom_id=${participantsType.chatroomID}&is_secret=${participantsType.isSecret}`
            );
        }
    }

    conversationsFetch(cmetaType: CmetaType) {
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

    fetchChatroomHome(chatroom: CHTYPE) {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.FETCH_CHATROOM_HOME}?chatroom_id=${chatroom.chatroom_id}`
        );
    }

    crSeenFn(crSeen: CRSeen) {
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

    chatroomSeen(chatroomSeen: ChatroomSeen) {
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
