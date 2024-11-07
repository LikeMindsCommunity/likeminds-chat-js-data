import { API } from '../../shared/constants/api.constant';

import {
    BlockMemberRequest,
    CANDM,
    CID,
    CheckDMLimitRequest,
    CheckDMLimitWithUuidRequest,
    CheckDMStatusRequest,
    CreateDMChatroomRequest,
    SendDMRequestRequest,
    CreateDMChatroomWithUuidRequest,
    CANDMWithUuid,
    FetchDMFeedRequest,
} from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import LMResponse from 'src/core/services/lmresponse';
import { CanDMFeedResponse } from './responseModels/CanDMFeedResponse';
import { GetChatroom } from '../../shared/api-responses/getChatroomResponse';
import { CheckDMStatus } from '../../shared/api-responses/CheckDMStatus';
import { CheckDMLimit } from '../../shared/api-responses/CheckDMLimit';
import { CreateDMChatroom } from '../../shared/api-responses/CreateDMChatroom';
import { SendDMRequest } from '../../shared/api-responses/SendDMRequest';
import { BlockMember } from '../../shared/api-responses/BlockMember';
import { CheckDMTab } from '../../shared/api-responses/CheckDMTab';

export class DirectMessage extends Base {
    fetchDMFeed(fetchDMFeedRequest: FetchDMFeedRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<GetChatroom>(
            `${environment.apiUrl}${API.CHATROOM_SYNC}?page=${fetchDMFeedRequest.page}&page_size=${fetchDMFeedRequest.pageSize}&chatroom_types=[${fetchDMFeedRequest.chatroomTypes}]&max_timestamp=${fetchDMFeedRequest.maxTimestamp}&min_timestamp=${fetchDMFeedRequest.minTimestamp}`
        );
    }

    checkDMStatus(checkDMStatus: CheckDMStatusRequest) {
        if (checkDMStatus.uuid) {
            return this.networkLibrary.makeAuthenticatedRequest<CheckDMStatus>(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}&uuid=${checkDMStatus.uuid}`
            );
        }
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMStatus>(
            `${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}`
        );
    }

    checkDMLimit(checkDMLimit: CheckDMLimitRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMLimit>(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimit.memberId}`
        );
    }

    checkDMLimitWithUuid(checkDMLimit: CheckDMLimitWithUuidRequest) {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMLimit>(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?uuid=${checkDMLimit.uuid}`
        );
    }

    createDMChatroom(createDMChatroom: CreateDMChatroomRequest) {
        const params = {
            member_id: createDMChatroom.memberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest<CreateDMChatroom>(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    createDMChatroomWithUuid(createDMChatroom: CreateDMChatroomWithUuidRequest) {
        const params = {
            uuid: createDMChatroom.uuid,
        };
        return this.networkLibrary.makeAuthenticatedRequest<CreateDMChatroom>(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    sendDMRequest(sendDMRequest: SendDMRequestRequest) {
        const params = {
            chatroom_id: sendDMRequest.chatroomId,
            chat_request_state: sendDMRequest.chatRequestState,
            text: sendDMRequest.text,
        };
        return this.networkLibrary.makeAuthenticatedRequest<SendDMRequest>(`${environment.apiUrl}${API.CHATROOM_DM_REQUEST}`, {
            method: 'POST',
            data: params,
        });
    }

    blockMember(blockMember: BlockMemberRequest) {
        const params = {
            chatroom_id: blockMember.chatroomId,
            status: blockMember.status,
        };
        return this.networkLibrary.makeAuthenticatedRequest<BlockMember>(`${environment.apiUrl}${API.CHATROOM_DM_BLOCK}`, {
            method: 'POST',
            data: params,
        });
    }

    checkDMTab() {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMTab>(`${environment.apiUrl}${API.HOME_DM_META}`);
    }

    // ******************

    getDMFeed(cid: CID): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.FETCH_DM_FEED}?community_id=${cid.community_id}`);
    }

    canDmFeed(dmCan: CANDM): Promise<any> {
        if (dmCan?.chatroomId) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&member_id=${dmCan.memberId}&chatroom_id=${dmCan.chatroomId}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&member_id=${dmCan.memberId}`
            );
        }
    }

    canDmFeedWithUuid(dmCan: CANDMWithUuid): Promise<LMResponse<CanDMFeedResponse>> {
        if (dmCan?.chatroomId) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&uuid=${dmCan.uuid}&chatroom_id=${dmCan.chatroomId}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&uuid=${dmCan.uuid}`
            );
        }
    }
}
