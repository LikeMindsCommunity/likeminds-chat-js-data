// import { LMSDKCallbacks } from '../LMCallback';

export declare type SdkConfig = {
    // xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    // lmCallback: LMSDKCallbacks;
};

export declare type InitUser = {
    isGuest: boolean;
    userUniqueId: string;
    userName?: string;
};
