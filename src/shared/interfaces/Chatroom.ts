import { Cohort } from './Cohort';

// Member Interface - Assuming 'Member' interface is predefined.
interface Member {
    // Define fields based on your existing Member model
}

// Conversation Interface - Assuming 'Conversation' interface is predefined.
interface Conversation {
    // Define fields based on your existing Conversation model
}

// Chatroom Interface
export interface Chatroom {
    member: Member;
    id: string;
    title: string;
    createdAt?: number;
    answerText?: string;
    state: number;
    unseenCount?: number;
    shareUrl?: string;
    communityId?: string;
    communityName?: string;
    type?: number;
    about?: string;
    header?: string;
    showFollowTelescope: boolean;
    showFollowAutoTag: boolean;
    cardCreationTime?: string;
    participantsCount?: string;
    totalResponseCount?: string;
    muteStatus: boolean;
    followStatus?: boolean;
    hasBeenNamed: boolean;
    hasReactions?: boolean;
    date?: string;
    isTagged?: boolean;
    isPending?: boolean;
    isPrivateMember?: boolean;
    isPinned?: boolean;
    isDeleted?: boolean;
    userId?: string;
    deletedBy?: string;
    deletedByMember?: Member;
    deletedByUserId?: string;
    updatedAt?: number;
    lastSeenConversationId?: string;
    lastConversationId?: string;
    dateEpoch?: number;
    isSecret?: boolean;
    secretChatroomParticipants?: number[];
    secretChatroomLeft?: boolean;
    topicId?: string;
    topic?: Conversation;
    autoFollowDone?: boolean;
    isEdited?: boolean;
    access?: number;
    memberCanMessage?: boolean;
    chatroomWithUserId?: number;
    chatroomWithUserName?: string;
    chatroomWithUser?: Member;
    cohorts?: Cohort[];
    externalSeen?: boolean;
    unreadConversationCount?: number;
    chatroomImageUrl?: string;
    accessWithoutSubscription?: boolean;
    totalAllResponseCount?: string;
    isConversationStored?: boolean;
    chatRequestState?: number;
    chatRequestedBy?: Member;
    chatRequestCreatedAt?: number;
    chatRequestedById?: number;
}
