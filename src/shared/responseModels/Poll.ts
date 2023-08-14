import { Member } from "./Member";

export interface Poll {
  id: string | null;
  text: string;
  isSelected: boolean | null;
  percentage: number | null;
  subText: string | null;
  noVotes: number | null;
  member: Member | null;
  userId: string | null;
}
