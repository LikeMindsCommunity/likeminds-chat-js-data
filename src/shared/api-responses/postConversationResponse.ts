/* eslint-disable @typescript-eslint/no-explicit-any */
import { SDKClientInfo } from './getChatroomResponse';

export interface Member {
    id: number;
    imageUrl: string;
    isGuest: boolean;
    name: string;
    organisationName: string | null;
    updatedAt: number;
    userUniqueId: string;
    uuid: string;
    sdkClientInfo: SDKClientInfo;
}

export interface Conversation {
    id: number;
    answer: string;
    createdAt: string;
    state: number;
    isEdited: boolean;
    hasFiles: boolean;
    date: string;
    attachmentCount: number;
    attachmentsUploaded: boolean;
    createdEpoch: number;
    isAnonymous: boolean;
    allowAddOption: boolean;
    reactions: any[];
    pollAnswerText: string;
    startTime: number;
    endTime: number;
    hasEventRecording: boolean;
    widgetId: string;
    chatroomId: number;
    memberId: number;
    member: Member;
    communityId: number;
}

export interface PostConversation {
    id: number;
    conversation: Conversation;
}
