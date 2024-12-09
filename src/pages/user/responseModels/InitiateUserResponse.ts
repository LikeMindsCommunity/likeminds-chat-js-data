import { Community } from '../../../shared/interfaces/Community';
import { Member } from '../../../shared/interfaces/Member';

export interface InitiateUserResponse {
    community: Community;
    accessToken: string;
    refreshToken: string;
    user: Member;
    appAccess: boolean;
    hasAnswers?: boolean;
}

export interface ValidateUserResponse {
    appAccess: boolean;
    community: Community;
    hasAnswers: boolean;
    user: Member;
}
