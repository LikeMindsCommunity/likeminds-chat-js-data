import { RealtimeTopic } from "../enums/realtimeTopic";

export interface WebSocketMessage {
    deviceId: string;
    topicMessageType: RealtimeTopic;
    rawData: string;
}