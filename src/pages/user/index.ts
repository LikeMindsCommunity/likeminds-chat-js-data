import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import { EditProfile, GetAllMembers, GetMemberChatroom, GetProfile, InitUser, MemberState, Search, USERTYPE } from './types';
import { Base } from 'src/base';
import { environment } from 'src/environment';

export class Member extends Base {
    networkLibrary = new NetworkLibrary();

    initiateUser(initUser: InitUser): Promise<any> {
        const params = {
            is_guest: initUser?.isGuest,
            user_unique_id: initUser?.userUniqueId,
            user_name: initUser?.userName,
        };

        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.SDK_INITIATE}`, {
                method: 'POST',
                data: params,
            })
            .then((resData: any) => {
                // Set the access token
                console.log('DL init=> ', resData);
                // console.log('DL init=> ', resData.data.data);
                // console.log('DL init=> ', resData.data.data.access_token);
                const accessToken = resData.data.access_token;
                this.networkLibrary.setAccessToken(accessToken);
                // console.log('set accessToken=> ', accessToken);
                const refreshToken = resData.data.access_token;
                this.networkLibrary.setRefreshToken(refreshToken);

                return { data: resData?.data, errorMessage: null, status: 200 };
            })
            .catch((error) => {
                console.log(error);
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

    getMemberState(memberState: MemberState): Promise<any> {
        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBER_STATE}?member_id=${memberState.memberId}`)
            .then((resData: any) => {
                return resData;
            });
    }

    editProfile(editProfile: EditProfile): Promise<any> {
        const params = {
            user_name: editProfile.userName,
            user_unique_id: editProfile.userUniqueId,
            image_url: editProfile.imageUrl,
        };
        return this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBER_PROFILE}`, {
            method: 'PUT',
            data: params,
        });
    }

    searchMembers(search: Search): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.search_type}&page=${search.page}&page_size=${search.page_size}`
        );
    }

    allMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?community_id=${userType.community_id}&chatroom_id=${userType.chatroom_id}&page=${userType.page}`
        );
    }

    getAllMembers(getAllMembers: GetAllMembers): Promise<any> {
        if (getAllMembers.memberState) {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&member_state=${getAllMembers.memberState}&page=${getAllMembers.page}`
            );
        } else {
            return this.networkLibrary.makeAuthenticatedRequest(
                `${environment.apiUrl}${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&page=${getAllMembers.page}`
            );
        }
    }

    dmAllMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.makeAuthenticatedRequest(
            `${environment.apiUrl}${API.DM_ALL_MEMBERS}?community_id=${userType.community_id}&member_state=${userType.member_state}&page=${userType.page}`
        );
    }
}
