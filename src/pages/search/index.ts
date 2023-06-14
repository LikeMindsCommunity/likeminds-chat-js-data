import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import { SearchType } from './types';
import httpInst from 'src/core/services/base.service';

export class Search {
    public networkLibrary = new NetworkLibrary();
    searchChatroom(searchType: SearchType): Promise<any> {
        return this.networkLibrary.get(
            `${API.SEARCH_CHATROOM}?follow_status=${searchType.followStatus}&page=${searchType.page}&page_size=${searchType.pageSize}&search=${searchType.search}&search_type=${searchType.searchType}`
        );
    }
}
