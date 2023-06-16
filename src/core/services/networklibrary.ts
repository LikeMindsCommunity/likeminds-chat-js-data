import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import TokenManager from './tokenmanager';

class ResponseWrapper<T> {
    private response: AxiosResponse<T>;

    constructor(response: AxiosResponse<T>) {
        this.response = response;
    }

    public getData(): T {
        return this.response.data;
    }

    public getStatusCode(): number {
        return this.response.status;
    }

    public getHeaders(): any {
        return this.response.headers;
    }
}

class NetworkLibrary {
    private tokenManager: TokenManager;

    private xApiKey: string | null;
    private xVersionCode: any | null;
    private xPlatformCode: string | null;

    // constructor(tokenManager: TokenManager) {
    constructor() {
        // this.tokenManager = tokenManager;
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

    private async makeRequest<T>(url: string, config?: AxiosRequestConfig): Promise<ResponseWrapper<T>> {
        try {
            const response = await axios(url, config);
            return new ResponseWrapper<T>(response);
        } catch (error) {
            console.error('Failed to make request:', error);
            throw error;
        }
    }

    public async makeAuthenticatedRequest<T>(url: string, config?: AxiosRequestConfig): Promise<ResponseWrapper<T>> {
        console.log('dl config=> ', config);
        // if (!this.tokenManager.getAccessToken()) {
        //     throw new Error('Access token is not set.');
        // }

        const requestConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                ...config?.headers,
                'x-sdk-source': 'chat',
                // Authorization: `Bearer ${this.tokenManager.getAccessToken()}`,
            },
        };

        const initApi = url.includes('initiate');
        const isRefreshRequest = url.includes('refresh');

        requestConfig.headers['x-platform-code'] = this.xPlatformCode;
        requestConfig.headers['x-version-code'] = this.xVersionCode;

        const cFeed = url.includes('community/feed');
        if (cFeed) requestConfig.headers['x-accept-version'] = 'v2';
        const isMarkRead = url.includes('mark_read');
        if (isMarkRead) requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        // Add the access token to the request headers
        if (this.tokenManager.getAccessToken && !initApi && !isRefreshRequest) {
            requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken}`;
        }

        // Add the apiKey in initiate api to the request headers
        if (initApi) requestConfig.headers['x-api-key'] = this.xApiKey;

        try {
            const response = await this.makeRequest<T>(url, requestConfig);

            if (response.getStatusCode() === 401) {
                // Access token failed, refresh it
                await this.tokenManager.refreshAccessToken();
                // Retry the request with the updated access token
                requestConfig.headers['Authorization'] = `Bearer ${this.tokenManager.getAccessToken()}`;
                return this.makeRequest<T>(url, requestConfig);
            }

            return response;
        } catch (error) {
            console.error('Failed to make authenticated request:', error);
            throw error;
        }
    }
}

export { ResponseWrapper, NetworkLibrary };
