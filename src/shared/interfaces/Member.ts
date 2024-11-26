import { MemberRole } from '../enums/Roles';
import { Question } from './Question';

// MemberActions Interface
export interface MemberActions {
    title: string;
    route: string;
}

// SDKClientInfo Interface
export interface SDKClientInfo {
    user: string;
    userUniqueId: string;
    uuid: string;
    communityId?: number;
    community?: number;
}

// Member Interface
export interface Member {
    id: number;
    userUniqueId: string;
    name: string;
    imageUrl?: string;
    questionAnswers?: Question[];
    state?: number;
    isGuest: boolean;
    customIntroText?: string;
    customClickText?: string;
    memberSince?: string;
    communityName?: string;
    isOwner: boolean;
    customTitle?: string;
    menu?: MemberActions[];
    communityId?: number;
    chatroomId?: number;
    route?: string;
    attendingStatus?: boolean;
    hasProfileImage: boolean;
    updatedAt?: number;
    sdkClientInfo?: SDKClientInfo;
    uuid: string;
    roles?: MemberRole[];
}
