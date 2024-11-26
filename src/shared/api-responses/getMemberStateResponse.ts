import { Member } from '../interfaces/Member';
import { MemberRight } from '../interfaces/MemberRight';

export interface GetMemberState {
    createdAt: string;
    editRequired: boolean;
    member: Member;
    memberRights: MemberRight[];
    state: number;
    toolState: number;
}
