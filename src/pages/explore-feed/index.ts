import { API } from '../../shared/constants/api.constant';
import httpInst from 'src/core/services/base.service';
import { ExploreFeedData } from './types';

export class ExploreFeed {
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<any> {
        return httpInst.get(`${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`);
    }
}
