// Index.user.class
import { API } from '../../shared/constants/api.constant';
import {
    EditProfile,
    GetAllMembersRequest,
    GetMemberChatroomRequest,
    GetProfileRequest,
    InitiateUserRequest,
    InitUserWithUuid,
    LeaveCommunityRequest,
    LogoutRequest,
    Search,
    USERTYPE,
    ValidateUserRequest,
} from './types';
import { Base } from 'src/base';
import { environment } from 'src/environment';

import { InitiateUserResponse, ValidateUserResponse } from './responseModels/InitiateUserResponse';
import LMResponse from '../../core/services/lmresponse';

export class Member extends Base {
    // networkLibrary = new NetworkLibrary();

    public async validateUser(validateUserRequest: ValidateUserRequest): Promise<LMResponse<ValidateUserResponse>> {
        this.networkLibrary.setAccessToken(validateUserRequest.accessToken);
        this.networkLibrary.setRefreshToken(validateUserRequest.refreshToken);
        const params = {
            access_token: validateUserRequest.accessToken,
            refresh_token: validateUserRequest.refreshToken,
            token_expiry_beta: validateUserRequest?.tokenExpiryBeta,
            rtm_token_expiry_beta: validateUserRequest?.rtmTokenExpiryBeta,
        };
        return this.networkLibrary.makeAuthenticatedRequest<ValidateUserResponse>(`${environment.apiUrl}${API.SDK_INITIATE}`, {
            method: 'GET',
            data: params,
        });
    }

    public initiateUser(initiateUserRequest: InitiateUserRequest): Promise<LMResponse<InitiateUserResponse>> {
        const params = {
            api_key: initiateUserRequest?.apiKey,
            is_guest: initiateUserRequest?.isGuest,
            user_unique_id: initiateUserRequest?.userUniqueId,
            user_name: initiateUserRequest?.userName,
            token_expiry_beta: initiateUserRequest?.tokenExpiryBeta,
            rtm_token_expiry_beta: initiateUserRequest?.rtmTokenExpiryBeta,
        };
        this.networkLibrary.setApiKey(params.api_key);
        return this.networkLibrary
            .makeAuthenticatedRequest<InitiateUserResponse>(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'POST',
                data: params,
            })
            .then((resData) => {
                sessionStorage.setItem('iud', JSON.stringify(params));

                const accessToken = resData?.data?.accessToken;
                this.networkLibrary.setAccessToken(accessToken);
                const refreshToken = resData?.data?.refreshToken;
                this.networkLibrary.setRefreshToken(refreshToken);

                return resData;
            });
    }

    initiateUserWithUuid(initUser: InitUserWithUuid): Promise<LMResponse<InitiateUserResponse>> {
        const params = {
            image_url: initUser?.imageUrl,
            is_guest: initUser?.isGuest,
            uuid: initUser?.uuid,
            user_name: initUser?.userName,
        };

        return this.networkLibrary
            .makeAuthenticatedRequest<InitiateUserResponse>(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'POST',
                data: params,
            })
            .then((respData) => {
                const accessToken = respData?.data?.accessToken;
                this.networkLibrary.setAccessToken(accessToken);
                const refreshToken = respData?.data?.refreshToken;
                this.networkLibrary.setRefreshToken(refreshToken);

                return respData;
            })
            .catch((error) => {
                return error;
            });
    }

    logout(logout: LogoutRequest): Promise<any> {
        const params = {
            refresh_token: logout.refreshToken,
        };
        localStorage.clear();

        return this.networkLibrary.makeAuthenticatedRequest(`${API.USER_LOGOUT}`, {
            method: 'POST',
            data: params,
        });
    }

    leaveCommunity(leaveCommunity: LeaveCommunityRequest): Promise<any> {
        const params = {
            uuids: leaveCommunity.uuids,
        };

        return this.networkLibrary.makeAuthenticatedRequest(`${API.LEAVE_COMMUNITY}`, {
            method: 'DELETE',
            data: params,
        });
    }

    getProfile(getProfile: GetProfileRequest): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_PROFILE}?user_id=${getProfile.userId}`
        );
    }

    getMemberChatroom(getMemberChatroom: GetMemberChatroomRequest): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_CHATROOM}?user_id=${getMemberChatroom.userId}&state=${getMemberChatroom.state}&page=${getMemberChatroom.page}`
        );
    }

    getQuestions(): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_QUESTIONS}`).then((resData) => {
            return resData;
        });
    }

    getMemberState(): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBER_STATE}`);
    }

    editProfile(editProfile: EditProfile): Promise<any> {
        const params = {
            user_name: editProfile.userName,
            user_unique_id: editProfile.userUniqueId,
            image_url: editProfile.imageUrl,
            name: editProfile?.name,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBER_PROFILE}`, {
            method: 'PUT',
            data: params,
        });
    }

    searchMembers(search: Search): Promise<any> {
        if (search.memberStates) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.searchType}&page=${search.page}&page_size=${search.pageSize}&member_states=${search.memberStates}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.searchType}&page=${search.page}&page_size=${search.pageSize}`
            );
        }
    }

    getAllMembers(getAllMembers: GetAllMembersRequest): Promise<any> {
        if (getAllMembers.memberState) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?member_state=${getAllMembers.memberState}&page=${getAllMembers.page}`
            );
        } else if (getAllMembers.chatroomId) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&page=${getAllMembers.page}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBERS}?page=${getAllMembers.page}`);
        }
    }

    // Old function

    dmAllMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.DM_ALL_MEMBERS}?community_id=${userType.community_id}&member_state=${userType.member_state}&page=${userType.page}`
        );
    }

    allMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?community_id=${userType.community_id}&chatroom_id=${userType.chatroom_id}&page=${userType.page}`
        );
    }
}
