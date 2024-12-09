// Community Interface
export interface Community {
    id: string;
    name: string;
    imageUrl?: string;
    membersCount?: number;
    updatedAt?: number;
    hideDmTab: boolean;
}
