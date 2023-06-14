import { API } from '../../shared/constants/api.constant';
import httpInst from 'src/core/services/base.service';
import { ExploreFeedData } from './types';
import NetworkLibrary from 'src/core/services/networklibrary';

export class ExploreFeed {
    public networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<any> {
        return this.networkLibrary.get(`${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`);
    }
}
