/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Widget {
    id: string;
    lmMeta: Record<string, any>; // Nullable key
    createdAt: number;
    metadata: Record<string, any>;
    parentEntityId: string;
    parentEntityType: string;
    updatedAt: number;
}
