/* eslint-disable @typescript-eslint/no-explicit-any */

import { Conversation } from '../interfaces/Conversation';
import { Widget } from '../interfaces/Widgets';

export interface PostConversationResponse {
    id: number;
    conversation: Conversation;
    widgets: Record<string, Widget>;
}
