import { Member } from '../interfaces/Member';

export interface ViewParticipantsResponse {
    canEditParticipant: boolean;
    participants: Member[];
    totalParticipantsCount?: number;
}
