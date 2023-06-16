import { environment } from 'src/environment';
import { API } from '../../shared/constants/api.constant';
import { ExploreFeedData } from './types';
import { NetworkLibrary } from 'src/core/services/networklibrary';

export class ExploreFeed {
    networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`
        );
    }
}
