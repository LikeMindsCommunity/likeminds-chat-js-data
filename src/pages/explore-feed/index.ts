import { API } from '../../shared/constants/api.constant';
import { ExploreFeedData } from './types';
import { ExploreFeedResponse } from './model/explore-feed-response';
import { environment } from '../../environments';
import { Base } from '../../base';
import LMResponse from '../../core/services/lmresponse';
import NetworkLibrary from '../../core/services/networklibrary';

export class ExploreFeed extends Base {
    networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<LMResponse<ExploreFeedResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`
        );
    }
}
