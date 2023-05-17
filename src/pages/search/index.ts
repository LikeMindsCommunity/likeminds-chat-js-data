import { Base } from '../../base';
import { API } from '../../shared/constants/api.constant';
import { SEARCHTYPE } from './types';

export class Search extends Base {
    searchChatroom(searchType: SEARCHTYPE): Promise<any> {
        return this.invoke(
            `${API.SEARCH_CHATROOM}?follow_status=${searchType.follow_status}&page=${searchType.page}&page_size=${searchType.page_size}&search=${searchType.search}&search_type=${searchType.search_type}`
        );
    }
}
