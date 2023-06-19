import NetworkLibrary from 'src/core/services/networklibrary';
import { API } from '../../shared/constants/api.constant';
import { environment } from 'src/environment';

export class MemberState {
    networkLibrary = new NetworkLibrary();

    private memberId: any;

    setMemberId(memberId: any) {
        this.memberId = memberId;
        return this;
    }

    build() {
        return this;
    }

    getMemberState(): Promise<any> {
        return this.networkLibrary
            .makeAuthenticatedRequest(`${environment.apiUrl}${API.COMMUNITY_MEMBER_STATE}?member_id=${this.memberId}`)
            .then((resData: any) => {
                return resData;
            });
    }
}

export default MemberState;

// const a = new MemberState().setMemberId('sasd').build()
