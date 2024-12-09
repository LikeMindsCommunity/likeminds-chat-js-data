import { Member } from '../interfaces/Member';

export interface GetTaggingListResponse {
    communityMembers?: Member[];
    groupTags?: GroupTag[];
}

export interface GroupTag {
    description: string;
    name: string;
    route: string;
    tag: string;
    imageUrl: string;
}
