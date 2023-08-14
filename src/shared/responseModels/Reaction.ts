import { Member } from "./Member";

export interface Reaction {
  member: Member | null;
  reaction: string;
}
