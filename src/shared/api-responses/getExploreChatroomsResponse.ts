/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SdkClientInfo {
    community: number;
    user: number;
    userUniqueId: string;
    uuid: string;
    widgetId: string;
}

export interface Member {
    communityId: number;
    createdAt: number;
    customTitle?: string;
    id: number;
    imageUrl: string;
    isGuest: boolean;
    isOwner: boolean;
    memberSince: string;
    name: string;
    route: string;
    sdkClientInfo: SdkClientInfo;
    state: number;
    userUniqueId: string;
    uuid: string;
}

export interface LastResponseMember extends Member {
    chatroomId: number;
}

export interface Attachment {
    height: number;
    index: number;
    meta: {
        size: number;
    };
    name: string;
    type: string;
    url: string;
    width: number;
}

export interface Topic {
    answer: string;
    attachmentCount: number;
    attachments: Attachment[];
    attachmentsUploaded: boolean;
    audios: any[];
    chatroomId: number;
    communityId: number;
    createdAt: string;
    createdEpoch: number;
    date: string;
    hasFiles: boolean;
    id: number;
    images: Attachment[];
    isEdited: boolean;
    member: Member;
    pdf: any[];
    reactions: any[];
    state: number;
    temporaryId: string;
    videos: any[];
    widgetId: string;
}

export interface ExploreChatroom {
    access: null;
    accessWithoutSubscription: boolean;
    answerText: string;
    answersCount: number;
    attachmentCount: number;
    attachmentsUploaded: boolean;
    attended: boolean;
    attendingCount: number;
    attendingStatus: boolean;
    audioCount: number;
    autoFollowDone: boolean;
    cardCreationTime: string;
    chatRequestCreatedAt: null;
    chatRequestState: null;
    chatRequestedBy: null;
    chatroomImageUrl?: string;
    coHosts?: any[];
    cohorts: any[];
    communityId: number;
    communityName: string;
    createdAt: string;
    customTag: string;
    date: string;
    dateEpoch: number;
    dateTime: number;
    duration: number;
    eventKind: string;
    externalSeen: boolean;
    followStatus: boolean;
    header: string;
    id: number;
    imageCount: number;
    includeMembersLater: boolean;
    isEdited: boolean;
    isGuest: boolean;
    isPaid: boolean;
    isPending: boolean;
    isPinned: boolean;
    isPrivate: boolean;
    isPrivateMember: boolean;
    isSecret: boolean;
    isTagged: boolean;
    lastResponseMembers: LastResponseMember[];
    member: Member;
    memberCanMessage: boolean;
    muteStatus: boolean;
    onlineLinkEnableBefore: number;
    onlineLinkType: null;
    participantsCount: number;
    pdfCount: number;
    pollsCount: number;
    reactions: any[];
    shareLink: string;
    state: number;
    thirdPartyUniqueId: null | string;
    title: string;
    topic?: Topic;
    totalResponseCount: number;
    type: number;
    updatedAt: number;
    videoCount: number;
}

export interface GetExploreChatrooms {
    chatrooms: ExploreChatroom[];
    pinnedChatroomsCount: number;
    // widgets: {};
}
