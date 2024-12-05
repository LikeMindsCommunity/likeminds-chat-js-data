// NetworkLibrary
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import TokenManager from './tokenmanager';
import LMResponse from './lmresponse';
import { LMSDKCallbacks } from '../../LMCallback';
import { TokenValues } from '../../shared/tokens';
import { ConversationState } from 'src/shared/enums/conversationstate';

class NetworkLibrary {
    private tokenManager: TokenManager;

    private xApiKey: string | null;
    private excludedConversationStates: ConversationState[] | null;

    private lmSdkCallbacks: LMSDKCallbacks | null;

    constructor(lmSdkCallbacks: LMSDKCallbacks) {
        this.lmSdkCallbacks = lmSdkCallbacks;
        this.tokenManager = new TokenManager(lmSdkCallbacks);
    }

    public setAccessToken(accessToken: string) {
        this.tokenManager.setAccessToken(accessToken);
    }
    public setRefreshToken(refreshToken: string) {
        this.tokenManager.setRefreshToken(refreshToken);
    }

    public getAccessToken() {
        return this.tokenManager.getAccessToken();
    }

    public getRefreshToken() {
        return this.tokenManager.getRefreshToken();
    }

    public onRefreshAccessToken() {
        return this.tokenManager.refreshAccessToken();
    }

    public setUserInLocalStorage(user: string) {
        localStorage.setItem(TokenValues.LOCAL_USER, user);
    }
    public setApiKeyInLocalStorage(apiKey: string) {
        localStorage.setItem(TokenValues.LOCAL_API_KEY, apiKey);
    }

    public setAccessTokenInLocalStorage(token: string) {
        localStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, token);
    }

    public setRefreshTokenInLocalStorage(token: string) {
        localStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, token);
    }

    public getAccessTokenFromLocalStorage() {
        return localStorage.getItem(TokenValues.LOCAL_ACCESS_TOKEN);
    }

    public getRefreshTokenFromLocalStorage() {
        return localStorage.getItem(TokenValues.LOCAL_REFRESH_TOKEN);
    }

    public getApiKeyFromLocalStorage() {
        return localStorage.getItem(TokenValues.LOCAL_API_KEY);
    }
    public getUserFromLocalStorage() {
        return localStorage.getItem(TokenValues.LOCAL_USER);
    }
    //
    public setPlatformCode(platFormCode: string) {
        this.tokenManager.setPlatformCode(platFormCode);
    }

    public setVersionCode(versionCode: any) {
        this.tokenManager.setVersionCode(versionCode);
    }

    // Api Key
    public setApiKey(xApiKey: string) {
        this.xApiKey = xApiKey;
    }
    public getApiKey() {
        return this.xApiKey;
    }
    // Api Key
    public setExcludedConversationStates(excludedConversationStates: ConversationState[]) {
        this.excludedConversationStates = excludedConversationStates;
    }

    public getExcludedConversationStates() {
        return this.excludedConversationStates;
    }

    public setLMSDKCallbacks(callback: LMSDKCallbacks) {
        this.lmSdkCallbacks = callback;
        this.tokenManager.setLMSdkCallbacks(callback);
    }

    private async makeRequest<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.request<T>({ url, ...config });
    }

    public async makeAuthenticatedRequest<T>(url: string, config?: AxiosRequestConfig): Promise<LMResponse<T>> {
        const requestConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                ...config?.headers,
                'x-sdk-source': 'chat',
            },
        };

        const initApi = url.includes('initiate');
        const isRefreshRequest = url.includes('refresh');
        requestConfig.headers['Content-Type'] = 'application/json';
        // requestConfig.headers['x-platform-code'] = this.tokenManager.getPlatformCode();
        requestConfig.headers['x-version-code'] = this.tokenManager.getVersionCode();

        const device = url.includes('user/device/push');
        if (!device) requestConfig.headers['x-platform-code'] = this.tokenManager.getPlatformCode();

        const cFeed = url.includes('community/feed');
        if (cFeed) requestConfig.headers['x-accept-version'] = 'v2';

        const isMarkRead = url.includes('mark_read');
        if (isMarkRead) requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        // Add the access token to the request header
        // if (this.tokenManager.getAccessToken && !initApi) {
        //     requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;
        // }

        if (this.tokenManager.getAccessToken() && this.tokenManager.getAccessToken().length) {
            requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;
        }

        // Add the apiKey in initiate api to the request headers
        // if (initApi) requestConfig.headers['x-api-key'] = this.xApiKey;
        if (initApi && config.method === 'POST') {
            if (this.tokenManager.getPlatformCode() === 'rt') {
                if (this.xApiKey && this.xApiKey.length) {
                    requestConfig.headers['x-api-key'] = this.xApiKey;
                } else {
                    throw 'Please provide the Api Key';
                }
            } else {
                requestConfig.headers['x-api-key'] = this.xApiKey;
            }
        }

        try {
            const response = await this.makeRequest<{ data: T }>(url, requestConfig);
            return new LMResponse<T>(response?.data?.data, null, true);
        } catch (error) {
            // if (error?.response && error?.response?.status === 401 && error?.response?.data?.error_message === 'Invalid LTM!') {
            if (error?.response && error?.response?.status === 401) {
                // Access token expired, refresh the token and retry the request
                if (url.includes('user/refresh')) {
                    const { accessToken, refreshToken } = await this.lmSdkCallbacks.onRefreshTokenExpired();
                    // TODO expose functions for storing tokens from DL
                    // done
                    this.tokenManager.setAccessToken(accessToken);
                    this.tokenManager.setRefreshToken(refreshToken);
                    // TODO add tokens in local storage too
                    // done
                    this.setAccessTokenInLocalStorage(accessToken);
                    this.setRefreshTokenInLocalStorage(refreshToken);
                } else {
                    await this.tokenManager.refreshAccessToken();
                }
                // Update the Authorization header with the new access token
                const updatedConfig = { ...requestConfig };
                updatedConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;

                // Retry the request
                return this.makeRequest<{ data: T }>(url, updatedConfig)
                    .then((refreshedResponse) => {
                        return new LMResponse<T>(refreshedResponse.data.data, null, true);
                    })
                    .catch((error) => {
                        if (error?.response && error?.response?.status >= 500) {
                            return new LMResponse<T>(null, error.message, false);
                        }
                    });
            }

            if (error?.response && error?.response?.status >= 500) {
                return new LMResponse<T>(null, error.message, false);
            }
        }
    }
}

export default NetworkLibrary;
