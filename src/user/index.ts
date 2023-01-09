import { API } from '../shared/api.constant';
import { Base } from '../base';
import { InIt, UserType } from './types';

export class Member extends Base {
    initSDK(sdk: InIt): Promise<any> {
        const response = this.invoke(`${API.SDK_RESOURCE}`, {
            method: 'POST',
            body: JSON.stringify(sdk),
        });
        const res = response.then((res: any) => {
            localStorage.setItem('__likeminds_user__', JSON.stringify(res.data.user));
            localStorage.setItem('__access_token_LTM__', res.data.access_token);
            localStorage.setItem('__refresh_token_RTM__', res.data.refresh_token);
        });

        return response;
    }

    allMembers(ut: UserType): Promise<any> {
        return this.invoke(`${API.ALL_MEMBERS}?community_id=${ut.community_id}&chatroom_id=${ut.chatroom_id}&page=${ut.page}`);
    }

    dmAllMembers(ut: UserType): Promise<any> {
        return this.invoke(`${API.DM_ALL_MEMBERS}?community_id=${ut.community_id}&member_state=${ut.member_state}&page=${ut.page}`);
    }
}
