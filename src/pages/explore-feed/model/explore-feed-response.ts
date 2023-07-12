export declare type ExploreFeedResponse = {
    access?: string;
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
    chatRequestCreatedAt: Date | null;
    chatRequestState: string | null;
    chatRequestedBy: string | null;
    cohorts: string[] | null;
    communityId: number;
    communityName: string;
    createdAt: string | number;
    date: string;
    dateEpoch: number;
    dateTime: number;
    duration: number;
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
    onlineLinkType: string | null;
    participantsCount: number;
    pdfCount: number;
    pollsCount: number;
    reactions: Reaction[];
    shareLink: string;
    state: number;
    thirdPartyUniqueId: string | null;
    title: string;
    totalResponseCount: number;
    type: number;
    videoCount: number;
};

interface LastResponseMember {
    chatroomId: number;
    communityId: number;
    createdAt: Date;
    id: number;
    imageUrl: string;
    isGuest: boolean;
    isOwner: boolean;
    memberSince: string;
    name: string;
    route: string;
    state: number;
    userUniqueId: string;
}

interface Member {
    communityId: number;
    createdAt: Date;
    customTitle: string | null;
    id: number;
    imageUrl: string;
    isGuest: boolean;
    isOwner: boolean;
    memberSince: string;
    name: string;
    route: string;
    state: number;
    userUniqueId: string;
}

interface Reaction {
    emoji: string;
    count: number;
}
