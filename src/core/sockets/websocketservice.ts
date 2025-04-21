import { ModelConverter } from 'src/utils/ModelConverter';
import { Base } from '../../base';
import { environment } from '../../environment';
import { Conversation } from 'src/shared/interfaces/Conversation';
import { RealtimeTopic } from 'src/shared/enums/realtimeTopic';
import { LMChatSubscribeChatroomCallback } from 'src/shared/interfaces/LMChatSubscribeChatroomCallback';
import { WebSocketMessage } from 'src/shared/interfaces/WebSocketMessage';
import { SubscribeChatroomResponse } from './models/ReponseModels/subscribeChatroomResponse';
import { SubscribeChatroomRequest } from './models/RequestModels/SubscribeChatroomRequest';


class WebSocketService extends Base {
    private socket: WebSocket | null = null;
    private wsChatroomId: string | null;
    private wsCallbacks: LMChatSubscribeChatroomCallback | null;
    private wsMaxReconnectAttempts: number;
    private wsReconnectDelay: number;
    private wsReconnectAttempts: number;

    private async connect(): Promise<void> {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const accessToken = await this.getAccessToken();
        if (!accessToken || !this.wsChatroomId) {
            console.error('Access Token or Chatroom ID is missing');
            return;
        }

        const chatroomEndpoint = `${environment.wsBaseUrl}/subscribe/chatroom:${this.wsChatroomId}`;

        const params = new URLSearchParams({
            'x-platform-code': this.xPlatformCode,
            'x-sdk-source': this.xSdkSource,
            Authorization: accessToken,
            'x-version-code': this.xVersionCode?.toString(),
        });

        // Construct the full WebSocket URL
        const wsUrl = `${chatroomEndpoint}?${params.toString()}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            this.wsReconnectAttempts = 0; // Reset retry attempts
            this.subscribeToChatroom();
        };

        this.socket.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        };

        this.socket.onerror = (error: Event) => {
            this.wsCallbacks.onError(JSON.stringify(error));
        };

        this.socket.onclose = async (event: CloseEvent) => {
            const retriableErrors = [500, 502, 503, 504, 429];
            const containsRetriableCode = retriableErrors.some((code) => event?.reason?.includes?.(code.toString()));
            if (event?.reason?.includes?.('401')) {
                await this.refreshTokenAndReconnect();
            } else if (containsRetriableCode) {
                this.reconnectWithBackoff();
            } else {
                this.wsCallbacks.onSocketConnectionClosed();
            }
        };
    }

    private subscribeToChatroom(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.wsCallbacks.onSocketConnectionOpen();
        }
    }

    private handleMessage(data: string): void {
        try {
            const parsedData = JSON.parse(data);
            const responseData: WebSocketMessage = ModelConverter.responseBodyParser(parsedData);
            if (responseData?.topicMessageType === RealtimeTopic.CONVERSATION) {
                const parsedConversation = JSON.parse(responseData?.rawData);
                const newConversation: SubscribeChatroomResponse = ModelConverter.responseBodyParser(parsedConversation);
                this.wsCallbacks.onMessageReceived(newConversation);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    async subscribeChatroom(subscribeChatroomRequest: SubscribeChatroomRequest, callback: LMChatSubscribeChatroomCallback): Promise<void> {
        if (!subscribeChatroomRequest.chatroomId) {
            callback.onError('Chatroom ID is missing');
            return;
        }
        this.wsCallbacks = callback;
        this.wsChatroomId = subscribeChatroomRequest.chatroomId;
        this.wsMaxReconnectAttempts = 5;
        this.wsReconnectDelay = 1000; // Initial delay in ms
        this.wsReconnectAttempts = 0;
        this.connect();
    }

    async unSubscribeChatroom(): Promise<void> {
        if (this.socket) {
            this.socket.close();
        }
    }

    private async refreshTokenAndReconnect(): Promise<void> {
        try {
            await this.networkLibrary.onRefreshAccessToken();
            this.reconnectWithBackoff();
        } catch (error) {
            this.wsCallbacks.onSocketConnectionClosed();
        }
    }

    private reconnectWithBackoff(): void {
        if (this.wsReconnectAttempts >= this.wsMaxReconnectAttempts) {
            this.wsCallbacks.onSocketConnectionClosed();
            return;
        }
        const delay = this.wsReconnectDelay * Math.pow(2, this.wsReconnectAttempts);
        setTimeout(() => {
            this.wsReconnectAttempts++;
            this.connect();
        }, delay);
    }
}

export default WebSocketService;
