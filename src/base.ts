import { SdkConfig } from './shared/types';
import NetworkLibrary from './core/services/networklibrary';
import { LMSDKCallbacks } from './LMCallback';
import { ConversationState } from './shared/enums/conversationstate';

export class Base {
    xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    excludedConversationStates: ConversationState[];
    networkLibrary: NetworkLibrary | null;

    constructor(sdkConfig: SdkConfig) {
        this.xPlatformCode = sdkConfig.xPlatformCode;
        this.xVersionCode = sdkConfig.xVersionCode;
        this.excludedConversationStates = sdkConfig.excludedConversationStates;
        this.networkLibrary = new NetworkLibrary(null);
        this.networkLibrary.setApiKey(this.xApiKey);
        this.networkLibrary.setPlatformCode(this.xPlatformCode);
        this.networkLibrary.setVersionCode(this.xVersionCode);
        this.networkLibrary.setExcludedConversationStates(this.excludedConversationStates);
    }

    public setLMSDKCallbacks(callback: LMSDKCallbacks) {
        this.networkLibrary.setLMSDKCallbacks(callback);
    }
    public setAccessTokenInLocalStorage(token: string) {
        this.networkLibrary.setAccessTokenInLocalStorage(token);
    }

    public setRefreshTokenInLocalStorage(token: string) {
        this.networkLibrary.setRefreshTokenInLocalStorage(token);
    }
    public setApiKeyInLocalStorage(apiKey: string) {
        this.networkLibrary.setApiKeyInLocalStorage(apiKey);
    }
    public setUserInLocalStorage(user: string) {
        this.networkLibrary.setUserInLocalStorage(user);
    }
    public getUserFromLocalStorage() {
        return this.networkLibrary.getUserFromLocalStorage();
    }
    public getApiKeyFromLocalStorage() {
        return this.networkLibrary.getApiKeyFromLocalStorage();
    }

    public getAccessTokenFromLocalStorage() {
        return this.networkLibrary.getAccessTokenFromLocalStorage();
    }

    public getRefreshTokenFromLocalStorage() {
        return this.networkLibrary.getRefreshTokenFromLocalStorage();
    }

    public getAccessToken() {
        return this.networkLibrary.getAccessToken();
    }

    public getRefreshToken() {
        return this.networkLibrary.getRefreshToken();
    }
}
