import { SubscribeChatroomResponse } from "src/core/sockets/models/ReponseModels/subscribeChatroomResponse";

export interface LMChatSubscribeChatroomCallback {
    onSocketConnectionOpen(): void;
    onMessageReceived(data: SubscribeChatroomResponse): void;
    onSocketConnectionClosed(): void;
    onError(errorMessage: string): void;
}