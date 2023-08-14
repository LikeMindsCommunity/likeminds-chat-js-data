export interface Community {
  id: string;
  name: string;
  imageUrl: string | null;
  membersCount: number | null;
  updatedAt: number | null;
  relationshipNeeded: boolean | true;
  hideDmTab: boolean | false;
}
