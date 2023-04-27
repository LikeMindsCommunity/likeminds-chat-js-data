import { API } from '../shared/api.constant';
import { Base } from '../base';
import { EditProfile, GetMemberChatroom, GetProfile, InitUser, Members, PROFILE, Search, USERTYPE } from './types';

export class Member extends Base {
    initiateUser(initUser: InitUser): Promise<any> {
        const response = this.invoke(`${API.SDK_INITIATE}`, {
            method: 'POST',
            body: JSON.stringify(initUser),
        });
        const res = response.then((resData: any) => {
            if (resData) {
                localStorage.setItem('__community__', JSON.stringify(resData.community));
                localStorage.setItem('__likeminds_user__', JSON.stringify(resData.user));
                localStorage.setItem('__access_token_LTM__', resData.access_token);
                localStorage.setItem('__refresh_token_RTM__', resData.refresh_token);
            }
        });
        return response;
    }

    getProfile(getProfile: GetProfile): Promise<any> {
        return this.invoke(`${API.COMMUNITY_MEMBER_PROFILE}?user_id=${getProfile.userId}`);
    }

    getMemberChatroom(getMemberChatroom: GetMemberChatroom): Promise<any> {
        return this.invoke(
            `${API.COMMUNITY_MEMBER_CHATROOM}?user_id=${getMemberChatroom.userId}&state=${getMemberChatroom.state}&page=${getMemberChatroom.page}`
        );
    }

    getQuestions(): Promise<any> {
        return this.invoke(`${API.COMMUNITY_QUESTIONS}`);
    }

    editProfile(editProfile: EditProfile): Promise<any> {
        return this.invoke(`${API.COMMUNITY_MEMBER_PROFILE}`, {
            method: 'PUT',
            body: JSON.stringify(editProfile),
        });
    }

    searchMembers(search: Search): Promise<any> {
        return this.invoke(
            `${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.search_type}&page=${search.page}&page_size=${search.page_size}`
        );
    }

    allMembers(userType: USERTYPE): Promise<any> {
        return this.invoke(
            `${API.COMMUNITY_MEMBERS}?community_id=${userType.community_id}&chatroom_id=${userType.chatroom_id}&page=${userType.page}`
        );
    }

    // getAllMembers(members: Members): Promise<any> {
    //     return this.invoke(`${API.COMMUNITY_MEMBERS}?page=${members.page}`);
    // }

    dmAllMembers(userType: USERTYPE): Promise<any> {
        return this.invoke(
            `${API.DM_ALL_MEMBERS}?community_id=${userType.community_id}&member_state=${userType.member_state}&page=${userType.page}`
        );
    }
}
