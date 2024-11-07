import { User } from "../models/member";
import { Reply } from "../models/replies";

export interface GetCommentDetailsResponse {
  success: boolean;
  data: {
    comment: Reply;
    users: Record<string, User>;
  };
}
