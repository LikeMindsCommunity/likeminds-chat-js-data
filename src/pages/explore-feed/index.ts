import { API } from '../../shared/constants/api.constant';
import { Base } from '../../base';
import { ExploreFeedData } from './types';

export class ExploreFeed extends Base {
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<any> {
        return this.invoke(`${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`);
    }
}
