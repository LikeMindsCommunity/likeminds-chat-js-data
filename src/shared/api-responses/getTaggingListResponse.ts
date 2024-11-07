// import { TaggingMember } from "../models/taggingMember";

import Member from '../models/member';

export interface GetTaggingList {
    members?: Member[];
    communityMembers?: Member[];
}
