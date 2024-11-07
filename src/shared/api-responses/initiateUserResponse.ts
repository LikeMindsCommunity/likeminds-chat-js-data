import { Community } from "../models/community";
import { User } from "../models/member";

export interface ValidateUserData {
  accessToken: string;
  appAccess: boolean;
  community: Community;
  hasAnswers: boolean;
  refreshToken: string;
  user: User;
}
export interface ValidateUserResponse {
  success: boolean;
  data?: ValidateUserData;
}
