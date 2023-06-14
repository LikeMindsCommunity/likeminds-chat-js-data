import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import { EditProfile, GetAllMembers, GetMemberChatroom, GetProfile, InitUser, MemberState, Search, USERTYPE } from './types';
import httpInst from 'src/core/services/base.service';
import { Base } from 'src/base';

export class Member extends Base {
    networkLibrary = new NetworkLibrary();
    getProfile(getProfile: GetProfile): Promise<any> {
        return this.networkLibrary.get(`${API.COMMUNITY_MEMBER_PROFILE}?user_id=${getProfile.userId}`);
    }

    getMemberChatroom(getMemberChatroom: GetMemberChatroom): Promise<any> {
        return this.networkLibrary.get(
            `${API.COMMUNITY_MEMBER_CHATROOM}?user_id=${getMemberChatroom.userId}&state=${getMemberChatroom.state}&page=${getMemberChatroom.page}`
        );
    }

    getQuestions(): Promise<any> {
        return this.networkLibrary.get(`${API.COMMUNITY_QUESTIONS}`).then((resData) => {
            return resData.data;
        });
    }

    getMemberState(memberState: MemberState): Promise<any> {
        return this.networkLibrary.get(`${API.COMMUNITY_MEMBER_STATE}?member_id=${memberState.memberId}`).then((resData: any) => {
            return resData.data;
        });
    }

    // getMemberState(memberState: MemberState): Promise<any> {
    //     return httpInst.get(`${API.COMMUNITY_MEMBER_STATE}?member_id=${memberState.memberId}`);
    // }

    editProfile(editProfile: EditProfile): Promise<any> {
        const params = {
            user_name: editProfile.userName,
            user_unique_id: editProfile.userUniqueId,
            image_url: editProfile.imageUrl,
        };
        return this.networkLibrary.put(`${API.COMMUNITY_MEMBER_PROFILE}`, params);
    }

    searchMembers(search: Search): Promise<any> {
        return this.networkLibrary.get(
            `${API.COMMUNITY_MEMBER_SEARCH}?search=${search.search}&search_type=${search.search_type}&page=${search.page}&page_size=${search.page_size}`
        );
    }

    allMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.get(
            `${API.COMMUNITY_MEMBERS}?community_id=${userType.community_id}&chatroom_id=${userType.chatroom_id}&page=${userType.page}`
        );
    }

    // getAllMembers(members: Members): Promise<any> {
    //     return httpInst.get(`${API.COMMUNITY_MEMBERS}?page=${members.page}`);
    // }

    getAllMembers(getAllMembers: GetAllMembers): Promise<any> {
        if (getAllMembers.memberState) {
            return this.networkLibrary.get(
                `${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&member_state=${getAllMembers.memberState}&page=${getAllMembers.page}`
            );
        } else {
            return this.networkLibrary.get(`${API.COMMUNITY_MEMBERS}?chatroom_id=${getAllMembers.chatroomId}&page=${getAllMembers.page}`);
        }
    }

    dmAllMembers(userType: USERTYPE): Promise<any> {
        return this.networkLibrary.get(
            `${API.DM_ALL_MEMBERS}?community_id=${userType.community_id}&member_state=${userType.member_state}&page=${userType.page}`
        );
    }
}
