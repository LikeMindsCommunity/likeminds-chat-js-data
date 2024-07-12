import { environment } from 'src/environment';
import { API } from '../../shared/constants/api.constant';
import { ExploreFeedData } from './types';
import NetworkLibrary from 'src/core/services/networklibrary';
import { Base } from 'src/base';
import { ExploreFeedResponse } from './model/explore-feed-response';
import LMResponse from 'src/core/services/lmresponse';

export class ExploreFeed extends Base {
    // networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<LMResponse<ExploreFeedResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`
        );
    }
}
