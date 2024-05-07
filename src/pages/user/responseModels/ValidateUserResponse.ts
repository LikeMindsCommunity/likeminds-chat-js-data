// import LMResponse from "../../LMResponse";
import { Community } from '../../../shared/responseModels/Community';
import { User } from '../../../shared/responseModels/User';

export interface ValidateUserResponse {
    accessToken: string;
    appAccess: boolean;
    community: Community;
    hasAnswers: boolean;
    refreshToken: string;
    user: User;
    // logoutResponse?: LMResponse<null> | null;
}
