import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import TokenManager from './tokenmanager';
import LMResponse from './lmresponse';

class NetworkLibrary {
    private tokenManager: TokenManager;

    private xApiKey: string | null;
    private xVersionCode: any | null;
    private xPlatformCode: string | null;

    constructor() {
        this.tokenManager = new TokenManager();
    }

    public setAccessToken(accessToken: string) {
        this.tokenManager.setAccessToken(accessToken);
    }
    public setRefreshToken(refreshToken: string) {
        this.tokenManager.setRefreshToken(refreshToken);
    }

    // Api Key
    public setApiKey(xApiKey: string) {
        this.xApiKey = xApiKey;
    }
    public getApiKey() {
        return this.xApiKey;
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

    private async makeRequest<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.request<T>({ url, ...config });
    }

    public async makeAuthenticatedRequest<T>(url: string, config?: AxiosRequestConfig): Promise<LMResponse<T>> {
        // if (!this.tokenManager.getAccessToken()) {
        //     throw new Error('Access token is not set.');
        // }

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
        requestConfig.headers['x-platform-code'] = this.xPlatformCode;
        requestConfig.headers['x-version-code'] = this.xVersionCode;

        const cFeed = url.includes('community/feed');
        if (cFeed) requestConfig.headers['x-accept-version'] = 'v2';
        const isMarkRead = url.includes('mark_read');
        if (isMarkRead) requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        // Add the access token to the request headers
        if (this.tokenManager.getAccessToken && !initApi && !isRefreshRequest) {
            requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;
        }

        // Add the apiKey in initiate api to the request headers
        if (initApi) requestConfig.headers['x-api-key'] = this.xApiKey;

        try {
            const response = await this.makeRequest<{ data: T }>(url, requestConfig);

            if (response.status === 401) {
                // Access token failed, refresh it
                await this.tokenManager.refreshAccessToken();
                // Retry the request with the updated access token
                requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getRefreshToken()}`;
                return this.makeRequest<{ data: T }>(url, requestConfig)
                    .then((refreshedResponse) => {
                        return new LMResponse<T>(refreshedResponse.data.data, null, true);
                    })
                    .catch((error) => {
                        console.error('Failed to make authenticated request:', error);
                        return new LMResponse<T>(null, error.message, false);
                    });
            }

            return new LMResponse<T>(response.data.data, null, true);
        } catch (error) {
            console.error('Failed to make authenticated request:', error);
            return new LMResponse<T>(null, error.message, false);
        }
    }
}

export default NetworkLibrary;
