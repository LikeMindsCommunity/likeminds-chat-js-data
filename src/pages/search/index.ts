import { API } from '../../shared/constants/api.constant';
import { SearchType } from './types';
import httpInst from 'src/core/services/base.service';

export class Search {
    searchChatroom(searchType: SearchType): Promise<any> {
        return httpInst.get(
            `${API.SEARCH_CHATROOM}?follow_status=${searchType.followStatus}&page=${searchType.page}&page_size=${searchType.pageSize}&search=${searchType.search}&search_type=${searchType.searchType}`
        );
    }
}
