import { Community } from '../interfaces/Community';
import { Member } from '../interfaces/Member';

export interface ValidateUserResponse {
    appAccess: boolean;
    community: Community;
    hasAnswers: boolean;
    user: Member;
}
export interface ValidateUser extends ValidateUserResponse {}
