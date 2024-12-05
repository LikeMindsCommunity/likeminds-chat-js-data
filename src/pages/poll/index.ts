import { API } from '../../shared/constants/api.constant';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import { AddPollOptionRequest, GetPollUsersRequest, PostPollConversationRequest, SubmitPollRequest } from './types';
import { PostConversationResponse } from '../../shared/api-responses/postConversationResponse';
import { GetPollUsersResponse } from '../../shared/api-responses/GetPollUsers';
import { AddPollOptionResponse } from '../../shared/api-responses/AddPollOption';
import { Nothing } from '../../shared/responseModels/Nothing';
import LMResponse from '../../core/services/lmresponse';

export class PollClient extends Base {
    postPollConversation(postPollConversationRequest: PostPollConversationRequest): Promise<LMResponse<PostConversationResponse>> {
        const params = {
            chatroom_id: postPollConversationRequest.chatroomId,
            temporary_id: postPollConversationRequest.temporaryId,
            state: postPollConversationRequest.state,
            replied_conversation_id: postPollConversationRequest.repliedConversationId,
            polls: postPollConversationRequest.polls,
            poll_type: postPollConversationRequest.pollType,
            multiple_select_state: postPollConversationRequest.multipleSelectState,
            multiple_select_no: postPollConversationRequest.multipleSelectNo,
            is_anonymous: postPollConversationRequest.isAnonymous,
            allow_add_option: postPollConversationRequest.allowAddOption,
            expiry_time: postPollConversationRequest.expiryTime,
            text: postPollConversationRequest.text,
        };
        return this.networkLibrary.makeAuthenticatedRequest<PostConversationResponse>(`${environment.apiUrl}${API.CONVERSATION}`, {
            method: 'POST',
            data: params,
        });
    }
    getPollUsers(getPollUsersRequest: GetPollUsersRequest): Promise<LMResponse<GetPollUsersResponse>> {
        if (getPollUsersRequest.conversationId) {
            return this.networkLibrary.makeAuthenticatedRequest<GetPollUsersResponse>(
                `${environment.apiUrl}${API.CONVERSATION_POLL_USERS}?poll_id=${getPollUsersRequest.pollId}&conversation_id=${getPollUsersRequest.conversationId}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest<GetPollUsersResponse>(
                `${environment.apiUrl}${API.CONVERSATION_POLL_USERS}?poll_id=${getPollUsersRequest.pollId}`
            );
        }
    }
    addPollOption(addPollOptionRequest: AddPollOptionRequest): Promise<LMResponse<AddPollOptionResponse>> {
        const params = {
            conversation_id: addPollOptionRequest.conversationId,
            poll: addPollOptionRequest.poll,
        };
        return this.networkLibrary.makeAuthenticatedRequest<AddPollOptionResponse>(`${environment.apiUrl}${API.CONVERSATION_POLL}`, {
            method: 'POST',
            data: params,
        });
    }
    submitPoll(submitPollRequest: SubmitPollRequest): Promise<LMResponse<Nothing>> {
        const params = {
            conversation_id: submitPollRequest.conversationId,
            polls: submitPollRequest.polls,
        };
        return this.networkLibrary.makeAuthenticatedRequest<Nothing>(`${environment.apiUrl}${API.CONVERSATION_POLL_SUBMIT}`, {
            method: 'POST',
            data: params,
        });
    }
}
