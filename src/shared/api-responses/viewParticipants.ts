import { SDKClientInfo } from './getChatroomResponse';

export interface Participant {
    id: number;
    imageUrl: string;
    isGuest: boolean;
    name: string;
    sdkClientInfo: SDKClientInfo;
    state: number;
    userUniqueId: string;
    uuid: string;
    customTitle?: string; // Optional property for custom title
}

export interface ViewParticipants {
    canEditParticipant: boolean;
    participants: Participant[];
    totalParticipantsCount?: number;
    // widgets: { [key: string]: any }; // Assuming widgets can have dynamic keys
}
