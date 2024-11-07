/* eslint-disable @typescript-eslint/no-explicit-any */
import { SdkClientInfo } from '../models/member';

export interface GetHomeFeed {
    cardAttachmentsMeta: Record<string, never>;
    chatroomsData: ChatroomData[];
    communityMeta: Record<string, CommunityMeta>;
    convAttachmentsMeta: Record<string, ConvAttachmentMeta[]>;
    convPollsMeta: Record<string, never>;
    conversationMeta: Record<string, ConversationMeta>;
    syncMeta: Record<string, never>;
    userMeta: Record<string, UserMeta>;
    widgets: Record<string, never>;
}

export interface ChatroomData {
    about: string | any;
    access: any;
    accessWithoutSubscription: boolean;
    attachmentCount: number;
    attachmentsUploaded: boolean;
    attendingStatus: boolean;
    autoFollowDone: boolean;
    cardId: number;
    chatRequestCreatedAt: any;
    chatRequestState: any;
    chatRequestedById: any;
    chatroomImageUrl: string | any;
    chatroomWithUserId: any;
    coHosts: string | any;
    communityId: number;
    createdAt: number;
    customTag: string;
    date: string;
    dateEpoch: number;
    dateTime: number;
    deletedByUserId: any;
    deviceId: string | any;
    eventKind: string;
    expiryTime: any;
    externalSeen: boolean;
    followStatus: boolean;
    hasBeenNamed: boolean;
    hasFiles: boolean;
    hasReactions: boolean;
    header: string;
    id: number;
    internalLink: any;
    isEdited: boolean;
    isPaid: boolean;
    isPending: boolean;
    isPrivate: boolean;
    isPrivateMember: boolean;
    isSecret: boolean;
    isTagged: boolean;
    lastConversationId: number;
    lastSeenConversationId: number | any;
    memberCanMessage: boolean;
    muteStatus: boolean;
    ogTags: any;
    onlineLink: string;
    onlineLinkType: any;
    secretChatroomLeft: boolean;
    secretChatroomParticipants: any;
    shareLink: string;
    state: number;
    title: string;
    topicId: number | any;
    type: number;
    unseenCount: number;
    updatedAt: number;
    userId: number;
}

export interface CommunityMeta {
    id: number;
    imageUrl: string;
    isPaid: boolean;
    name: string;
    purpose: string;
    subType: number;
    type: number;
}

export interface ConvAttachmentMeta {
    answerId: number;
    createdAt: number;
    dimensions: any;
    fileUrl: string;
    height: number;
    id: number;
    index: number;
    locationLat: any;
    locationLong: any;
    locationName: any;
    meta: {
        size: number;
    };
    name: string;
    thumbnailUrl: any;
    type: string;
    width: number;
}

export interface ConversationMeta {
    allowAddOption: boolean;
    answer: string;
    apiVersion: number;
    attachmentCount: number;
    attachmentsUploaded: boolean;
    cardId: number;
    coHosts: any;
    communityId: number;
    createdAt: string;
    createdEpoch: number;
    date: string;
    deletedByUserId: any;
    deviceId: string | any;
    endTime: number;
    expiryTime: any;
    hasFiles: boolean;
    hasReactions: boolean;
    header: any;
    id: number;
    internalLink: any;
    isAnonymous: boolean;
    isEdited: boolean;
    lastUpdated: number;
    location: any;
    locationLat: any;
    locationLong: any;
    multipleSelectNo: any;
    multipleSelectState: any;
    ogTags: any;
    onlineLinkEnableBefore: number;
    pollAnswerText: string;
    pollType: any;
    pollTypeText: any;
    previewChatroomId: any;
    previewCommunityId: any;
    previewType: any;
    replyChatroomId: any;
    replyId: any;
    startTime: number;
    state: number;
    submitTypeText: any;
    temporaryId: any;
    toShowResults: boolean;
    userId: number;
    widgetId: string;
    topicId: any;
}

export interface UserMeta {
    createdAt: number;
    customTitle: string;
    id: number;
    imageLink: string;
    imageUrl: string | any;
    isGuest: boolean;
    isOwner: boolean;
    name: string;
    sdkClientInfo: SdkClientInfo;
    state: number;
    userUniqueId: string;
    uuid: string;
}
