import { API } from '../../shared/constants/api.constant';
import { SearchConversationRequest, SearchType } from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import { SearchChatrooms } from '../../shared/api-responses/SearchChatroom';
import { SearchConversations } from '../../shared/api-responses/SearchConversation';

// Search.ts
export class Search extends Base {
    searchChatroom(searchType: SearchType) {
        return this.networkLibrary.makeAuthenticatedRequest<SearchChatrooms>(
            `${environment.apiUrl}${API.SEARCH_CHATROOM}?follow_status=${searchType.followStatus}&page=${searchType.page}&page_size=${searchType.pageSize}&search=${searchType.search}&search_type=${searchType.searchType}`
        );
    }

    searchConversation(searchConversation: SearchConversationRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<SearchConversations>(
            `${environment.apiUrl}${API.CONVERSATION_SEARCH}?chatroom_id=${searchConversation.chatroomId}&follow_status=${searchConversation.followStatus}&page=${searchConversation.page}&page_size=${searchConversation.pageSize}&search=${searchConversation.search}`
        );
    }
}
