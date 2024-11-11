import { Member } from '../interfaces/Member';

export interface ViewParticipants {
    canEditParticipant: boolean;
    participants: Member[];
    totalParticipantsCount?: number;
}
