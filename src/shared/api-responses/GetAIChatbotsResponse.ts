import { Member } from '../interfaces/Member';

export interface GetAIChatbotsResponse {
    page: number; // current page
    totalPages: number; // total pages as pageSize
    totalChatbots: number; // total chatbots present in the project
    users: Member[]; // list of all the chatbots present in the project
}
