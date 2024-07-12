import { SdkConfig } from './shared/types';
import NetworkLibrary from './core/services/networklibrary';
import { LMSDKCallbacks } from './LMCallback';

export class Base {
    xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    networkLibrary: NetworkLibrary | null;

    constructor(sdkConfig: SdkConfig) {
        // this.xApiKey = sdkConfig.xApiKey;
        this.xPlatformCode = sdkConfig.xPlatformCode;
        this.xVersionCode = sdkConfig.xVersionCode;
        this.networkLibrary = new NetworkLibrary(null);
        this.networkLibrary.setApiKey(this.xApiKey);
        this.networkLibrary.setPlatformCode(this.xPlatformCode);
        this.networkLibrary.setVersionCode(this.xVersionCode);
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
