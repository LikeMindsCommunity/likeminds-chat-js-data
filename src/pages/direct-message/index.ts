/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    BlockMember,
    CANDM,
    CID,
    CheckDMLimit,
    CheckDMLimitWithUuid,
    CheckDMStatus,
    CreateDMChatroom,
    FetchDMFeed,
    SendDMRequest,
    CreateDMChatroomWithUuid,
    CANDMWithUuid,
} from './types';
import { API } from '../../shared/constants/api.constant';
import { CreateDMChatroomResponse } from './responseModels/CreateDMChatroomResponse';
import { CanDMFeedResponse } from './responseModels/CanDMFeedResponse';
import { environment } from '../../environments';
import { Base } from '../../base';
import LMResponse from '../../core/services/lmresponse';
import { ModelConverter } from '../../utils/ModelConverter';
import { DMLimitResponse } from './responseModels/DMLimitResponse';
import NetworkLibrary from '../../core/services/networklibrary';

export class DirectMessage extends Base {
    public networkLibrary = new NetworkLibrary();
    fetchDMFeed(fetchDMFeed: FetchDMFeed): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM}?page=${fetchDMFeed.page}`);
    }

    checkDMStatus(checkDMStatus: CheckDMStatus): Promise<any> {
        if (checkDMStatus.uuid) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}&uuid=${checkDMStatus.uuid}`
            );
        }
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.DM_STATUS}?req_from=${checkDMStatus.requestFrom}`);
    }

    checkDMLimit(checkDMLimit: CheckDMLimit): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?member_id=${checkDMLimit.memberId}`
        );
    }

    checkDMLimitWithUuid(checkDMLimit: CheckDMLimitWithUuid): Promise<LMResponse<DMLimitResponse>> {
        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_LIMIT}?uuid=${checkDMLimit.uuid}`)
            .then((respData: any) => {
                const convertedResp: DMLimitResponse = ModelConverter.responseBodyParser(respData);

                return new LMResponse<DMLimitResponse>(convertedResp, null, true);
            })
            .catch((error: any) => {
                return new LMResponse<DMLimitResponse>(null, error.message || 'An error occurred', false);
            });
    }

    createDMChatroom(createDMChatroom: CreateDMChatroom): Promise<any> {
        const params = {
            member_id: createDMChatroom.memberId,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
            method: 'POST',
            data: params,
        });
    }

    createDMChatroomWithUuid(createDMChatroom: CreateDMChatroomWithUuid): Promise<LMResponse<CreateDMChatroomResponse>> {
        const params = {
            uuid: createDMChatroom.uuid,
        };
        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_CREATE}`, {
                method: 'POST',
                data: params,
            })
            .then((respData: any) => {
                const convertedResp: CreateDMChatroomResponse = ModelConverter.responseBodyParser(respData);

                return new LMResponse<CreateDMChatroomResponse>(convertedResp, null, true);
            })
            .catch((error: any) => {
                return new LMResponse<CreateDMChatroomResponse>(null, error.message || 'An error occurred', false);
            });
    }

    sendDMRequest(sendDMRequest: SendDMRequest): Promise<any> {
        const params = {
            chatroom_id: sendDMRequest.chatroomId,
            chat_request_state: sendDMRequest.chatRequestState,
            text: sendDMRequest.text,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_REQUEST}`, {
            method: 'POST',
            data: params,
        });
    }

    blockMember(blockMember: BlockMember): Promise<any> {
        const params = {
            chatroom_id: blockMember.chatroomId,
            status: blockMember.status,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.CHATROOM_DM_BLOCK}`, {
            method: 'POST',
            data: params,
        });
    }

    checkDMTab(): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.HOME_DM_META}`);
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
            return this.networkLibrary
                .makeAuthenticatedRequest(
                    `${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&uuid=${dmCan.uuid}&chatroom_id=${dmCan.chatroomId}`
                )
                .then((respData: any) => {
                    const convertedResp: CanDMFeedResponse = ModelConverter.responseBodyParser(respData);

                    return new LMResponse<CanDMFeedResponse>(convertedResp, null, true);
                })
                .catch((error: any) => {
                    return new LMResponse<CanDMFeedResponse>(null, error.message || 'An error occurred', false);
                });
        } else {
            return this.networkLibrary
                .makeAuthenticatedRequest(`${environment.apiUrl}${API.DM_STATUS}?req_from=${dmCan.reqFrom}&uuid=${dmCan.uuid}`)
                .then((respData: any) => {
                    const convertedResp: CanDMFeedResponse = ModelConverter.responseBodyParser(respData);

                    return new LMResponse<CanDMFeedResponse>(convertedResp, null, true);
                })
                .catch((error: any) => {
                    return new LMResponse<CanDMFeedResponse>(null, error.message || 'An error occurred', false);
                });
        }
    }
}
