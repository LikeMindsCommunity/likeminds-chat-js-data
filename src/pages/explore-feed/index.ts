import { environment } from 'src/environment';
import { API } from '../../shared/constants/api.constant';
import { GetExploreFeedRequest } from './types';

import { Base } from 'src/base';

import { GetExploreFeedResponse } from '../../shared/api-responses/getExploreChatroomsResponse';
import LMResponse from '../../core/services/lmresponse';

export class ExploreFeed extends Base {
    // networkLibrary = new NetworkLibrary();
    getExploreFeed(getExploreFeedRequest: GetExploreFeedRequest): Promise<LMResponse<GetExploreFeedResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<GetExploreFeedResponse>(
            `${environment.apiUrl}${API.COMMUNITY_FEED}?order_type=${getExploreFeedRequest.orderType}&page=${getExploreFeedRequest.page}`
        );
    }
}
