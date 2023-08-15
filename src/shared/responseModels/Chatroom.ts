import { Member } from './Member';
import { Reaction } from './Reaction';
import { Conversation } from './Conversation';
import { Cohort } from './Cohort';

export interface Chatroom {
    member: Member | null;
    id: string;
    title: string;
    createdAt: number | null;
    answerText: string | null;
    state: number;
    unseenCount: number | null;
    shareUrl: string | null;
    communityId: string | null;
    communityName: string | null;
    type: number | null;
    about: string | null;
    header: string | null;
    showFollowTelescope: boolean | null;
    showFollowAutoTag: boolean | null;
    cardCreationTime: string | null;
    participantsCount: string | null;
    totalResponseCount: string | null;
    muteStatus: boolean | null;
    followStatus: boolean | null;
    hasBeenNamed: boolean | null;
    hasReactions: boolean | null;
    date: string | null;
    isTagged: boolean | null;
    isPending: boolean | null;
    isPinned: boolean | null;
    isDeleted: boolean | null;
    userId: string | null;
    deletedBy: string | null;
    deletedByMember: Member | null;
    updatedAt: number | null;
    lastSeenConversationId: string | null;
    lastConversationId: string | null;
    dateEpoch: number | null;
    isSecret: boolean | null;
    secretChatroomParticipants: number[] | null;
    secretChatroomLeft: boolean | null;
    reactions: Reaction[] | null;
    topicId: string | null;
    topic: Conversation | null;
    autoFollowDone: boolean | null;
    isEdited: boolean | null;
    access: number | null;
    memberCanMessage: boolean | null;
    cohorts: Cohort[] | null;
    externalSeen: boolean | null;
    unreadConversationCount: number | null;
    chatroomImageUrl: string | null;
    accessWithoutSubscription: boolean | null;
}

//add chatroomWithUser and chatRequestState
