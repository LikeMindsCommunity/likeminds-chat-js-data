// AttachmentMeta Interface
interface AttachmentMeta {
    numberOfPage?: number;
    size?: number;
    duration?: number;
}

// Attachment Interface
export interface Attachment {
    id?: string;
    name: string;
    url: string;
    type: string;
    index?: number;
    width?: number;
    height?: number;
    awsFolderPath: string;
    localFilePath: string;
    thumbnailUrl: string;
    thumbnailAWSFolderPath: string;
    thumbnailLocalFilePath: string;
    meta: AttachmentMeta;
    createdAt: number;
    updatedAt: number;
    fileUrl: string;
}
