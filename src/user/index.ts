import { API } from '../shared/api.constant';
import { Base } from '../base';
import { InitUser, Members, PROFILE, Search, USERTYPE } from './types';

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

    allMembers(userType: USERTYPE): Promise<any> {
        return this.invoke(
            `${API.ALL_MEMBERS}?community_id=${userType.community_id}&chatroom_id=${userType.chatroom_id}&page=${userType.page}`
        );
    }

    getAllMembers(members: Members): Promise<any> {
        return this.invoke(`${API.ALL_MEMBERS}?page=${members.page}`);
    }

    searchMembers(search: Search): Promise<any> {
        return this.invoke(
            `${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.search_type}&page=${search.page}&page_size=${search.page_size}`
        );
    }

    getProfile(profile: PROFILE): Promise<any> {
        return this.invoke(`${API.COMMUNITY_MEMBER_PROFILE}?user_id=${profile.user_id}`);
    }

    dmAllMembers(userType: USERTYPE): Promise<any> {
        return this.invoke(
            `${API.DM_ALL_MEMBERS}?community_id=${userType.community_id}&member_state=${userType.member_state}&page=${userType.page}`
        );
    }
}
