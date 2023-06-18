import axios from 'axios';
import { environment } from 'src/environment';
import { API } from 'src/shared/constants/api.constant';

// TokenManager.ts
class TokenManager {
    private accessToken: string | null;
    private refreshToken: string | null;

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

    public async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error('Refresh token is not set.');
        }

        try {
            const response: any = await axios.post(`${environment.apiUrl}${API.REFRESH_TOKEN_API}`, {
                refreshToken: this.refreshToken,
            });
            console.log('DL access=> ', response);
            const accessToken = response.data.data || response.data;

            this.accessToken = accessToken.access_token;
            this.setRefreshToken(accessToken.refresh_token);
            this.setAccessToken(accessToken.access_token);
            return accessToken.access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            throw error;
        }
    }
}

export default TokenManager;
