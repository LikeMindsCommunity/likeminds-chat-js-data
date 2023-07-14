import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environment';
import { API } from 'src/shared/constants/api.constant';

// TokenManager.ts
class TokenManager {
    private accessToken: string | null;
    private refreshToken: string | null;
    private xVersionCode: any | null;
    private xPlatformCode: string | null;

    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
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

    public async refreshAccessToken(): Promise<void> {
        
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
            const accessToken = response.data.data || response.data;

            this.accessToken = accessToken.access_token;
            this.setRefreshToken(accessToken.refresh_token);
            this.setAccessToken(accessToken.access_token);
            return accessToken.access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            if (error?.response && error?.response?.status >= 500) throw error;
        }
    }
}

export default TokenManager;
