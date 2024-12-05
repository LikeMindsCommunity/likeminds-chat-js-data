// Index.user.class
import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import {
    EditProfile,
    GetAllMembers,
    GetMemberChatroom,
    GetProfile,
    InitUser,
    InitUserWithUuid,
    LeaveCommunity,
    Logout,
    Search,
    USERTYPE,
    ValidateUser,
} from './types';
import { Base } from 'src/base';
import { environment } from 'src/environment';
import LMResponse from 'src/core/services/lmresponse';
import { InitiateUserResponse } from './responseModels/InitiateUserResponse';
import { ModelConverter } from 'src/utils/ModelConverter';

export class Member extends Base {
    // networkLibrary = new NetworkLibrary();

    public async validateUser(request: ValidateUser): Promise<any> {
        this.networkLibrary.setAccessToken(request.accessToken);
        this.networkLibrary.setRefreshToken(request.refreshToken);
        const params = {
            access_token: request.accessToken,
            refresh_token: request.refreshToken,
            token_expiry_beta: request?.tokenExpiryBeta,
            rtm_token_expiry_beta: request?.rtmTokenExpiryBeta,
        };

        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'GET',
                data: params,
            })
            .then((resData: any) => {
                // Handle the response and return the LMResponse object

                return resData;
            })
            .catch((error) => {
                return {
                    success: false,
                    errorMessage: error,
                };
            });
    }

    public initiateUser(initUser: InitUser): Promise<any> {
        const params = {
            api_key: initUser?.apiKey,
            is_guest: initUser?.isGuest,
            user_unique_id: initUser?.userUniqueId,
            user_name: initUser?.userName,
            token_expiry_beta: initUser?.tokenExpiryBeta,
            rtm_token_expiry_beta: initUser?.rtmTokenExpiryBeta,
        };
        this.networkLibrary.setApiKey(params.api_key);
        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'POST',
                data: params,
            })
            .then((resData: any) => {
                sessionStorage.setItem('iud', JSON.stringify(params));

                const accessToken = resData?.data?.access_token;
                this.networkLibrary.setAccessToken(accessToken);
                const refreshToken = resData?.data?.refresh_token;
                this.networkLibrary.setRefreshToken(refreshToken);

                return { data: resData?.data, errorMessage: null, success: true };
            })
            .catch((error) => {
                if (error?.response && error?.response?.status >= 500) {
                    console.log({ data: null, errorMessage: error.error_message, success: false });
                }
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
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'POST',
                data: params,
            })
            .then((respData: any) => {
                const accessToken = respData?.data?.access_token;
                this.networkLibrary.setAccessToken(accessToken);
                const refreshToken = respData?.data?.refresh_token;
                this.networkLibrary.setRefreshToken(refreshToken);

                const convertedResp: InitiateUserResponse = ModelConverter.responseBodyParser(respData);

                return new LMResponse<InitiateUserResponse>(convertedResp, null, true);
            })
            .catch((error) => {
                return new LMResponse<InitiateUserResponse>(null, error.message || 'An error occurred', false);
            });
    }

    logout(logout: Logout): Promise<any> {
        const params = {
            refresh_token: logout.refreshToken,
        };
        localStorage.clear();

        return this.networkLibrary.makeAuthenticatedRequest(`${API.USER_LOGOUT}`, {
            method: 'POST',
            data: params,
        });
    }

    leaveCommunity(leaveCommunity: LeaveCommunity): Promise<any> {
        const params = {
            uuids: leaveCommunity.uuids,
        };

        return this.networkLibrary.makeAuthenticatedRequest(`${API.LEAVE_COMMUNITY}`, {
            method: 'DELETE',
            data: params,
        });
    }

    getProfile(getProfile: GetProfile): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_PROFILE}?user_id=${getProfile.userId}`
        );
    }

    getMemberChatroom(getMemberChatroom: GetMemberChatroom): Promise<any> {
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

    getAllMembers(getAllMembers: GetAllMembers): Promise<any> {
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
