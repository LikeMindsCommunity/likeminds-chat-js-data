import { Member } from '../responseModels/Member';

export interface AddPollOption {
    poll: {
        id: number;
    };
    id: number;
    member: Member;
    text: string;
    userId: number;
}
