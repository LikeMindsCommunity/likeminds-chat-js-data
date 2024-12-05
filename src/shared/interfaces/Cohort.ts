import { Member } from './Member';

// Cohort Interface
export interface Cohort {
    id?: number;
    totalMembers?: number;
    name?: string;
    members?: Member[];
}
