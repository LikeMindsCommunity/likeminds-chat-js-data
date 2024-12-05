// AttachmentMeta Interface
export interface AttachmentMeta {
    numberOfPage?: number;
    size?: number;
    duration?: number;
    answerId?: number;
    createdAt?: number;

    fileUrl?: string;
    height?: number;
    id?: number;
    index?: number;

    meta?: {
        size: number;
    };
    name?: string;
    thumbnailUrl?: string | null;
    type?: string;
    width?: number;
}

// Attachment Interface
export interface Attachment {
    id?: string;
    name?: string;
    url?: string;
    type?: string;
    index?: number;
    width?: number;
    height?: number;
    awsFolderPath?: string;
    localFilePath?: string;
    thumbnailUrl?: string;
    thumbnailAWSFolderPath?: string;
    thumbnailLocalFilePath?: string;
    meta?: AttachmentMeta;
    createdAt?: number;
    updatedAt?: number;
    fileUrl?: string;
}
