import { ModelConverter } from 'src/utils/ModelConverter';
import { Base } from '../../base';
import { environment } from '../../environment';
import { Conversation } from 'src/shared/interfaces/Conversation';

enum RealtimeTopic {
    CONVERSATION = 'conversation',
}

export interface SubscribeChatroomRequest {
    chatroomId: string;
}

export interface LMChatSubscribeChatroomCallback {
    onSocketConnectionOpen(): void;
    onMessageReceived(data: ParsedWebSocketMessage): void;
    onSocketConnectionClosed(): void;
    onError(errorMessage: string): void;
}

interface WebSocketMessage {
    deviceId: string;
    topicMessageType: string;
    rawData: string;
}

interface ParsedWebSocketMessage {
    conversation: Conversation;
    id: number;
    totalParticipantsCount: number;
    widgets: Record<string, any>;
}

class WebSocketService extends Base {
    private async connect(): Promise<void> {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
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
            const containsRetriableCode = retriableErrors.some((code) => event.reason.includes(code.toString()));
            if (event.reason.includes('401')) {
                await this.refreshTokenAndReconnect();
            } else if (containsRetriableCode) {
                this.reconnectWithBackoff();
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
                const newConversation: ParsedWebSocketMessage = ModelConverter.responseBodyParser(parsedConversation);
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
        this.connect();
    }

    async unSubscribeChatroom(): Promise<void> {
        if (this.socket) {
            this.socket.close();
            this.wsCallbacks.onSocketConnectionClosed();
        }
    }

    private async refreshTokenAndReconnect(): Promise<void> {
        try {
            await this.networkLibrary.onRefreshAccessToken();
            this.reconnectWithBackoff();
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    }

    private reconnectWithBackoff(): void {
        if (this.wsReconnectAttempts >= this.wsMaxReconnectAttempts) {
            console.error('Max reconnect attempts reached.');
            return;
        }
        const delay = this.wsReconnectDelay * Math.pow(2, this.wsReconnectAttempts);
        console.log(`Reconnecting in ${delay / 1000} seconds...`);
        setTimeout(() => {
            this.wsReconnectAttempts++;
            this.connect();
        }, delay);
    }
}

export default WebSocketService;
