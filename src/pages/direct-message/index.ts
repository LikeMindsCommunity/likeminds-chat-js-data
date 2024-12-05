import { API } from '../../shared/constants/api.constant';
import {
    BlockMemberRequest,
    CANDM,
    CID,
    CheckDMLimitRequest,
    CheckDMLimitWithUuidRequest,
    CheckDMStatusRequest,
    CreateDMChatroomRequest,
    SendDMRequest,
    CreateDMChatroomWithUuidRequest,
    CANDMWithUuid,
    FetchDMFeedRequest,
} from './types';
import { environment } from 'src/environment';
import { Base } from 'src/base';
import { CanDMFeedResponse } from './responseModels/CanDMFeedResponse';
import { CheckDMStatusResponse } from '../../shared/api-responses/CheckDMStatus';
import { CheckDMLimitResponse } from '../../shared/api-responses/CheckDMLimit';
import { CreateDMChatroomResponse } from '../../shared/api-responses/CreateDMChatroom';
import { BlockMemberResponse } from '../../shared/api-responses/BlockMember';
import { CheckDMTabResponse } from '../../shared/api-responses/CheckDMTab';
import { SyncChatroomResponse } from '../../shared/api-responses/getChatroomSync';
import LMResponse from '../../core/services/lmresponse';
import { SendDMRequestResponse } from '../../shared/api-responses/SendDMRequest';

export class DirectMessage extends Base {
    fetchDMFeed(fetchDMFeedRequest: FetchDMFeedRequest): Promise<LMResponse<SyncChatroomResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<SyncChatroomResponse>(
            `${environment.apiUrl}${API.CHATROOM_SYNC}?page=${fetchDMFeedRequest.page}&page_size=${fetchDMFeedRequest.pageSize}&chatroom_types=[${fetchDMFeedRequest.chatroomTypes}]&max_timestamp=${fetchDMFeedRequest.maxTimestamp}&min_timestamp=${fetchDMFeedRequest.minTimestamp}`
        );
    }

    checkDMStatus(checkDMStatusRequest: CheckDMStatusRequest): Promise<LMResponse<CheckDMStatusResponse>> {
        if (checkDMStatusRequest.uuid) {
            return this.networkLibrary.makeAuthenticatedRequest<CheckDMStatusResponse>(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatusRequest.requestFrom}&uuid=${checkDMStatusRequest.uuid}`
            );
        }
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMStatusResponse>(
            `${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatusRequest.requestFrom}`
        );
    }
    /**
     * @deprecated Use the new {@link checkDMLimitWithUuid} method instead.
     */
    checkDMLimit(checkDMLimitRequest: CheckDMLimitRequest): Promise<LMResponse<CheckDMLimitResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMLimitResponse>(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimitRequest.memberId}`
        );
    }

    checkDMLimitWithUuid(checkDMLimitRequest: CheckDMLimitWithUuidRequest): Promise<LMResponse<CheckDMLimitResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMLimitResponse>(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?uuid=${checkDMLimitRequest.uuid}`
        );
    }
    /**
     * @deprecated Use the new {@link createDMChatroomWithUuid} method instead.
     */
    createDMChatroom(createDMChatroomRequest: CreateDMChatroomRequest): Promise<LMResponse<CreateDMChatroomResponse>> {
        const params = {
            member_id: createDMChatroomRequest.memberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest<CreateDMChatroomResponse>(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    createDMChatroomWithUuid(createDMChatroomRequest: CreateDMChatroomWithUuidRequest): Promise<LMResponse<CreateDMChatroomResponse>> {
        const params = {
            uuid: createDMChatroomRequest.uuid,
        };
        return this.networkLibrary.makeAuthenticatedRequest<CreateDMChatroomResponse>(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    sendDMRequest(sendDMRequest: SendDMRequest): Promise<LMResponse<SendDMRequestResponse>> {
        const params = {
            chatroom_id: sendDMRequest.chatroomId,
            chat_request_state: sendDMRequest.chatRequestState,
            text: sendDMRequest.text,
        };
        return this.networkLibrary.makeAuthenticatedRequest<SendDMRequestResponse>(`${environment.apiUrl}${API.CHATROOM_DM_REQUEST}`, {
            method: 'POST',
            data: params,
        });
    }

    blockMember(blockMemberRequest: BlockMemberRequest): Promise<LMResponse<BlockMemberResponse>> {
        const params = {
            chatroom_id: blockMemberRequest.chatroomId,
            status: blockMemberRequest.status,
        };
        return this.networkLibrary.makeAuthenticatedRequest<BlockMemberResponse>(`${environment.apiUrl}${API.CHATROOM_DM_BLOCK}`, {
            method: 'POST',
            data: params,
        });
    }

    checkDMTab(): Promise<LMResponse<CheckDMTabResponse>> {
        return this.networkLibrary.makeAuthenticatedRequest<CheckDMTabResponse>(`${environment.apiUrl}${API.HOME_DM_META}`);
    }

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
