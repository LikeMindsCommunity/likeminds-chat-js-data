// import { LMSDKCallbacks } from '../LMCallback';

import { ConversationState } from './enums/conversationstate';

export declare type SdkConfig = {
    // xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    excludedConversationStates: ConversationState[];
    // lmCallback: LMSDKCallbacks;
};

export declare type InitUser = {
    isGuest: boolean;
    userUniqueId: string;
    userName?: string;
};
