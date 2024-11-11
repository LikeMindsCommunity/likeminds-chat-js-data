import { Member } from '../interfaces/Member';

export interface AddPollOption {
    poll: {
        id: number;
    };
    id: number;
    member: Member;
    text: string;
    userId: number;
}
