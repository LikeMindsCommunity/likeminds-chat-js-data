/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environment';
import { API } from 'src/shared/constants/api.constant';
import { LMSDKCallbacks } from '../../LMCallback';
import { TokenValues } from '../../shared/tokens';
import { ConversationState } from 'src/shared/enums/conversationstate';

// TokenManager.ts
class TokenManager {
    private accessToken: string | null;
    private refreshToken: string | null;
    private xVersionCode: any | null;
    private xPlatformCode: string | null;
    private lmSdkCallback: LMSDKCallbacks | null;
    private excludedConversationStates: ConversationState[] | null;

    constructor(lmSdkCallback: LMSDKCallbacks) {
        this.lmSdkCallback = lmSdkCallback;
        this.accessToken = null;
        this.refreshToken = null;
        // this.excludedConversationStates = null;
    }
    public setLMSdkCallbacks(callback: LMSDKCallbacks) {
        this.lmSdkCallback = callback;
    }
    // Access Token
    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public getAccessToken() {
        return this.accessToken;
    }

    // Refresh token
    public setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

    public getRefreshToken() {
        return this.refreshToken;
    }

    // ExcludedConversationStates
    public setExcludedConversationStates(excludedConversationStates: ConversationState[]) {
        this.excludedConversationStates = excludedConversationStates;
    }
    public getExcludedConversationStates() {
        return this.setExcludedConversationStates;
    }

    // Platform Code
    public setPlatformCode(xPlatformCode: string) {
        this.xPlatformCode = xPlatformCode;
    }
    public getPlatformCode() {
        return this.xPlatformCode;
    }

    // Version Code
    public setVersionCode(xVersionCode: number) {
        this.xVersionCode = xVersionCode;
    }

    public getVersionCode() {
        return this.xVersionCode;
    }

    // internal function to clear credentials stored in tokenManager class
    public clearTokenManager() {
        this.accessToken = null
        this.refreshToken = null
    }

    public async refreshAccessToken(): Promise<string> {
        try {
            const url = `${environment.apiUrl}${API.REFRESH_TOKEN_API}`;
            const config: AxiosRequestConfig = {
                // Request headers or other options
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.getRefreshToken()}`,
                    'x-platform-code': this.getPlatformCode(),
                    'x-version-code': this.getVersionCode(),
                },
            };

            const response: any = await axios.post(url, {}, config);
            const { access_token, refresh_token } = response.data.data;
            this.accessToken = access_token;
            this.setRefreshToken(refresh_token);
            this.setAccessToken(access_token);

            if (this.xPlatformCode === 'rt') {
                localStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, access_token);
                localStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, refresh_token);
            }
            if (this.lmSdkCallback.onAccessTokenExpiredAndRefreshed) {
                this.lmSdkCallback.onAccessTokenExpiredAndRefreshed(this.accessToken, this.refreshToken);
            }
            return access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            const { accessToken, refreshToken } = await this.lmSdkCallback.onRefreshTokenExpired();

            this.setAccessToken(accessToken);
            this.setRefreshToken(refreshToken);
            if (this.xPlatformCode === 'rt') {
                localStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, accessToken);
                localStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, refreshToken);
            }
            // this.setRefreshTokenInLocalStorage(refreshToken);
            if (error?.response && error?.response?.status >= 500) throw error;
        }
    }
}

export default TokenManager;
