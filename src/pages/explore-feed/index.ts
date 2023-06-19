import { environment } from 'src/environment';
import { API } from '../../shared/constants/api.constant';
import { ExploreFeedData } from './types';
import NetworkLibrary from 'src/core/services/networklibrary';
import { Base } from 'src/base';

export class ExploreFeed extends Base {
    networkLibrary = new NetworkLibrary();
    getExploreFeed(exploreFeedData: ExploreFeedData): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${exploreFeedData.orderType}&page=${exploreFeedData.page}`
        );
    }
}
