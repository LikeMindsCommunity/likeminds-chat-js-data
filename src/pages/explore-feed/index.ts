import { environment } from 'src/environment';
import { API } from '../../shared/constants/api.constant';
import { ExploreFeedData } from './types';

import { Base } from 'src/base';

import { GetExploreChatrooms } from '../../shared/api-responses/getExploreChatroomsResponse';

export class ExploreFeed extends Base {
    // networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData) {
        return this.networkLibrary.makeAuthenticatedRequest<GetExploreChatrooms>(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`
        );
    }
}
