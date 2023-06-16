import axios from 'axios';
import { environment } from 'src/config.staging';
import { API } from 'src/shared/constants/api.constant';

// TokenManager.ts
class TokenManager {
    private accessToken: string | null;
    private refreshToken: string | null;

    private xApiKey: string | null;
    private xVersionCode: number | null;
    private xPlatformCode: string | null;
    private xSdkSource: string | null;

    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.xApiKey = null;
        this.xPlatformCode = null;
        this.xVersionCode = null;
        this.xSdkSource = null;
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

    // Source Code
    public setSourceCode(xSdkSource: string) {
        this.xSdkSource = xSdkSource;
    }

    public getSourceCode() {
        return this.xSdkSource;
    }

    public refreshAccessToken(): Promise<string> {
        // Perform an API call to refresh the access token
        console.log('calling refresh token');
        return axios
            .post(
                `${environment.apiUrl}${API.REFRESH_TOKEN_API}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${this.refreshToken}`,
                    },
                }
            )
            .then((response: any) => {
                console.log('dl refresh =>', response);
                const newAccessToken = response.data?.accessToken;
                this.accessToken = newAccessToken;
                return newAccessToken;
            })
            .catch((error) => {
                console.error('Failed to refresh access token:', error);
                throw error;
            });
    }

    public refreshInterceptor = async (config: any) => {
        const initApi = config.url.includes('initiate');
        const isRefreshRequest = config.url.includes('refresh');

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        config.headers['x-platform-code'] = this.xPlatformCode;
        config.headers['x-version-code'] = this.xVersionCode;
        config.headers['x-sdk-source'] = 'chat';

        const cFeed = config.url.includes('community/feed');
        if (cFeed) config.headers['x-accept-version'] = 'v2';
        const isMarkRead = config.url.includes('mark_read');
        if (isMarkRead) config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        // Add the access token to the request headers
        if (this.accessToken && !initApi && !isRefreshRequest) {
            config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        // Add the apiKey in initiate api to the request headers
        if (initApi) config.headers['x-api-key'] = this.xApiKey;

        // Check if the request receives a 401 Unauthorized response
        if (config.response?.status === 401 && this.refreshToken) {
            try {
                // Refresh the access token
                const newAccessToken = await this.refreshAccessToken();
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                // Handle token refresh failure
                console.error('Failed to refresh access token:', error);
                // Optionally, you can redirect the user to the login page or perform other error handling
            }
        }

        return config;
    };
}

export default TokenManager;
