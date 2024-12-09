import { Member } from '../interfaces/Member';

export interface AddPollOptionResponse {
    poll: {
        id: number;
    };
    id: number;
    member: Member;
    text: string;
    userId: number;
}
