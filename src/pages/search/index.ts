import { API } from '../../shared/constants/api.constant';
import { SearchConversationRequest, SearchType } from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import { SearchChatroomsResponse } from '../../shared/api-responses/SearchChatroom';
import { SearchConversationsResponse } from '../../shared/api-responses/SearchConversation';
import LMResponse from '../../core/services/lmresponse';

// Search.ts
export class Search extends Base {
    searchChatroom(searchChatroomRequest: SearchType): Promise<LMResponse<SearchChatroomsResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<SearchChatroomsResponse>(
            `${environment.apiUrl}${API.SEARCH_CHATROOM}?follow_status=${searchChatroomRequest.followStatus}&page=${searchChatroomRequest.page}&page_size=${searchChatroomRequest.pageSize}&search=${searchChatroomRequest.search}&search_type=${searchChatroomRequest.searchType}`
        );
    }

    searchConversation(searchConversationRequest: SearchConversationRequest): Promise<LMResponse<SearchConversationsResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<SearchConversationsResponse>(
            `${environment.apiUrl}${API.CONVERSATION_SEARCH}?chatroom_id=${searchConversationRequest.chatroomId}&follow_status=${searchConversationRequest.followStatus}&page=${searchConversationRequest.page}&page_size=${searchConversationRequest.pageSize}&search=${searchConversationRequest.search}`
        );
    }
}
