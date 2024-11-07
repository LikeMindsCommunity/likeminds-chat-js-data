import { User } from "../models/member";

interface MemberRight {
  id: number;
  isLocked: boolean;
  isSelected: boolean;
  state: number;
  subTitle?: string;
  title: string;
}

export interface GetMemberStateResponse {
  success: boolean;
  data: {
    createdAt: string;
    editRequired: boolean;
    member: User;
    memberRights: MemberRight[];
    state: number;
    toolState: number;
  };
}
