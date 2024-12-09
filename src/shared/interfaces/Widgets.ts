export interface Widget {
    id: string;
    lmMeta: Record<string, any> | null; // Nullable key
    createdAt: number;
    metadata: Record<string, any>;
    parentEntityId: string;
    parentEntityType: string;
    updatedAt: number;
}
