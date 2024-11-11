// import { TaggingMember } from "../models/taggingMember";

import { Member } from '../interfaces/Member';

export interface GetTaggingList {
    members?: Member[];
    communityMembers?: Member[];
}
