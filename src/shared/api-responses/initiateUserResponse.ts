import { Community } from '../interfaces/Community';
import { Member } from '../interfaces/Member';

export interface ValidateUserData {
    accessToken: string;
    appAccess: boolean;
    community: Community;
    hasAnswers: boolean;
    refreshToken: string;
    user: Member;
}
export interface ValidateUser extends ValidateUserData {}
