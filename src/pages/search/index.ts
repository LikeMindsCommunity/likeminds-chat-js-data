import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import { SearchConversation, SearchType } from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';

export class Search extends Base {
    public networkLibrary = new NetworkLibrary();
    searchChatroom(searchType: SearchType): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.SEARCH_CHATROOM}?follow_status=${searchType.followStatus}&page=${searchType.page}&page_size=${searchType.pageSize}&search=${searchType.search}&search_type=${searchType.searchType}`
        );
    }

    searchConversation(searchConversation: SearchConversation): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CONVERSATION_SEARCH}?chatroom_id=${searchConversation.chatroomId}&follow_status=${searchConversation.followStatus}&page=${searchConversation.page}&page_size=${searchConversation.pageSize}&search=${searchConversation.search}}`
        );
    }
}
