// NetworkLibrary
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import TokenManager from './tokenmanager';
import LMResponse from './lmresponse';

class NetworkLibrary {
    private tokenManager: TokenManager;

    private xApiKey: string | null;

    constructor() {
        this.tokenManager = new TokenManager();
    }

    public setAccessToken(accessToken: string) {
        this.tokenManager.setAccessToken(accessToken);
    }
    public setRefreshToken(refreshToken: string) {
        this.tokenManager.setRefreshToken(refreshToken);
    }

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

        // Add the access token to the request headers
        if (this.tokenManager.getAccessToken && !initApi) {
            requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;
        }

        // Add the apiKey in initiate api to the request headers
        if (initApi) requestConfig.headers['x-api-key'] = this.xApiKey;

        try {
            const response = await this.makeRequest<{ data: T }>(url, requestConfig);
            return new LMResponse<T>(response?.data?.data, null, true);
        } catch (error) {
            if (error?.response && error?.response?.status === 401) {
                // Access token expired, refresh the token and retry the request
                await this.tokenManager.refreshAccessToken();

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
