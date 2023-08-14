import { AttachmentMeta } from "./AttachmentMeta";

export interface Attachment {
  id: string | null;
  name: string | null;
  url: string;
  type: string;
  index?: number | null;
  width?: number | null;
  height?: number | null;
  awsFolderPath: string | null;
  localFilePath: string | null;
  thumbnailUrl: string | null;
  thumbnailAWSFolderPath: string | null;
  thumbnailLocalFilePath: string | null;
  meta: AttachmentMeta | null;
  createdAt: number | null;
  updatedAt: number | null;
}
