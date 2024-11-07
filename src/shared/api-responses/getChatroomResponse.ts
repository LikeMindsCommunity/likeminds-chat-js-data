import Conversation from '../models/conversations';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SDKClientInfo {
    community: number;
    user: number;
    userUniqueId: string;
    uuid: string;
    widgetId: string;
}

export interface Member {
    communityId: number;
    createdAt: number;
    customTitle: string;
    id: number;
    imageUrl: string;
    isGuest: boolean;
    isOwner: boolean;
    memberSince: string;
    name: string;
    route: string;
    sdkClientInfo: SDKClientInfo;
    state: number;
    userUniqueId: string;
    uuid: string;
}

export interface LastResponseMember extends Member {
    chatroomId: number;
}

export interface Chatroom {
    aboutRecording: any;
    access: any;
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
    chatRequestCreatedAt: any;
    chatRequestState: any;
    chatRequestedBy: any;
    chatroomWithUser?: Member;
    chatroomImageUrl: string;
    coHosts: any[];
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
    onlineLinkType: any;
    participantsCount: number;
    pdfCount: number;
    pollsCount: number;
    reactions: any[];
    recordingUrlOgTags: any;
    recordingsAttachments: any[];
    recordingsAttachmentsView: number;
    recordingsUrl: any[];
    shareLink: string;
    showFollowAutoTag: boolean;
    showFollowTelescope: boolean;
    state: number;
    thirdPartyUniqueId: string;
    title: string;
    totalResponseCount: number;
    type: number;
    updatedAt: number;
    videoCount: number;
    topic?: Conversation | null;
}

export interface ChatroomAction {
    id: number;
    title: string;
}

export interface BrandingAdvanced {
    buttonsIconsColour: string;
    headerColour: string;
    textLinksColour: string;
}

export interface BrandingBasic {
    primaryColour: string;
}

export interface Branding {
    advanced: BrandingAdvanced;
    basic: BrandingBasic;
}

export interface CommunitySettingRight {
    id: number;
    isLocked: boolean;
    isSelected: boolean;
    state: number;
    title: string;
    subTitle?: string;
}

export interface Community {
    autoApproval: boolean;
    branding: Branding;
    communitySettingRights: CommunitySettingRight[];
    feeEvent: number;
    feeMembership: number;
    feePaymentPages: number;
    gracePeriod: number;
    hideDmTab: boolean;
    id: number;
    imageUrl: string;
    isDiscoverable: boolean;
    isFreemiumCommunity: boolean;
    isPaid: boolean;
    isWhitelabel: boolean;
    membersCount: number;
    name: string;
    purpose: string;
    referralEnabled: boolean;
    subType: number;
    type: number;
    updatedAt: number;
}

export interface ConversationUser {
    id: number;
    imageUrl: string;
    name: string;
}

export interface GetChatroom {
    canAccessSecretChatroom: boolean | undefined;
    chatroom: Chatroom;
    chatroomActions: ChatroomAction[];
    community: Community;
    conversationUsers: ConversationUser[];
    lastConversationId: number;
    participantCount: number;
    unreadMessages: number;
    // widgets: any;
}
