import { Member } from "./Member";

export interface Cohort {
  id: number | null;
  totalMembers: number | null;
  name: string | null;
  members: Member[] | null;
}
