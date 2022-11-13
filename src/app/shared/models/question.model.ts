import { ICommunity } from './community.model';

export class QuestionModel {
    community_id: string | number;
    questions: IQuestion[];
    timestamp: number;

    constructor(community_id: string | number, questions: IQuestion[], timestamp: number) {
        this.community_id = community_id;
        this.questions = questions;
        this.timestamp = timestamp;
    }
}

export interface ICommunityQuestion {
    questions: any[],
    community: ICommunity,
    toast: string | null,
    aj_expired: boolean,
    success : boolean,
}

export interface IQuestion {
    id: number,
    question_title: string,
    state: number,
    value: string,
    optional: boolean,
    help_text: string,
    field: boolean
    community_id?: number,
    is_hidden?: boolean,
    rank?: number,
    options?: any
}