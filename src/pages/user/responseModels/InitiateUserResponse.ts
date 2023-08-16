import { Community } from 'src/shared/responseModels/Community';
import { User } from 'src/shared/responseModels/User';

export interface InitiateUserResponse {
    community: Community;
    accessToken: string;
    refreshToken: string;
    user: User;
    appAccess: boolean;
    hasAnswers?: boolean;
}
