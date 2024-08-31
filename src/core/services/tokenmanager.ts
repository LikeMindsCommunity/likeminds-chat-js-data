/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environment';
import { API } from 'src/shared/constants/api.constant';
import { LMSDKCallbacks } from '../../LMCallback';
import { TokenValues } from '../../shared/tokens';

// TokenManager.ts
class TokenManager {
    private accessToken: string | null;
    private refreshToken: string | null;
    private xVersionCode: any | null;
    private xPlatformCode: string | null;
    private lmSdkCallback: LMSDKCallbacks | null;
    constructor(lmSdkCallback: LMSDKCallbacks) {
        this.lmSdkCallback = lmSdkCallback;
        this.accessToken = null;
        this.refreshToken = null;
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
            this.setRefreshToken(accessToken.refresh_token);
            this.setAccessToken(accessToken.access_token);
            // TODO set tokens in local storage
            if (this.xPlatformCode === "rt") {
                localStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, accessToken.access_token);
                localStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, accessToken.refresh_token);
            }
            this.lmSdkCallback.onAccessTokenExpiredAndRefreshed(this.accessToken, this.refreshToken);
            return accessToken.access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            const { accessToken, refreshToken } = await this.lmSdkCallback.onRefreshTokenExpired();

            this.setAccessToken(accessToken);
            this.setRefreshToken(refreshToken);
            if (this.xPlatformCode === "rt") {
                localStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, accessToken);
                localStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, refreshToken);
            }
            // this.setRefreshTokenInLocalStorage(refreshToken);
            if (error?.response && error?.response?.status >= 500) throw error;
        }
    }
}

export default TokenManager;

////////////////////////////////////////////////////////////////////////////////

// import axios, { AxiosRequestConfig } from 'axios';
// import { environment } from 'src/environment';
// import { API } from 'src/shared/constants/api.constant';
// import NetworkLibrary from './networklibrary';

// // TokenManager.ts
// class TokenManager {
//     networkLibrary = new NetworkLibrary();
//     private accessToken: string | null;
//     private refreshToken: string | null;
//     private xVersionCode: any | null;
//     private xPlatformCode: string | null;

//     constructor() {
//         this.accessToken = null;
//         this.refreshToken = null;
//     }

//     // Access Token
//     public setAccessToken(accessToken: string) {
//         this.accessToken = accessToken;
//     }

//     public getAccessToken() {
//         return this.accessToken;
//     }

//     // Refresh token
//     public setRefreshToken(refreshToken: string) {
//         this.refreshToken = refreshToken;
//     }

//     public getRefreshToken() {
//         return this.refreshToken;
//     }

//     // Platform Code
//     public setPlatformCode(xPlatformCode: string) {
//         this.xPlatformCode = xPlatformCode;
//     }
//     public getPlatformCode() {
//         return this.xPlatformCode;
//     }

//     // Version Code
//     public setVersionCode(xVersionCode: number) {
//         this.xVersionCode = xVersionCode;
//     }

//     public getVersionCode() {
//         return this.xVersionCode;
//     }

//     public async initiateUser(initUser: any): Promise<void> {
//         try {
//             const url = `${environment.apiUrl}${API.SDK_INITIATE}`;
//             const response: any = await axios.post(url, initUser);
//             const accessToken = response.data.data || response.data;

//             this.setRefreshToken(accessToken.refresh_token);
//             this.setAccessToken(accessToken.access_token);
//             return accessToken.access_token;
//         } catch (error) {
//             console.error('Failed to refresh access token:', error);
//         }
//     }

//     public async refreshAccessToken(): Promise<void> {
//         try {
//             const url = `${environment.apiUrl}${API.REFRESH_TOKEN_API}`;
//             const config: AxiosRequestConfig = {
//                 // Request headers or other options
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${this.getRefreshToken()}`,
//                     'x-platform-code': this.getPlatformCode(),
//                     'x-version-code': this.getVersionCode(),
//                 },
//             };

//             const response: any = await axios.post(url, {}, config);
//             const accessToken = response.data.data || response.data;

//             this.accessToken = accessToken.access_token;
//             this.setRefreshToken(accessToken.refresh_token);
//             this.setAccessToken(accessToken.access_token);
//             return accessToken.access_token;
//         } catch (error) {
//             if (error?.response && error?.response?.status === 401 && error?.response?.data?.error_message === 'Invalid RTM!') {
//                 console.log('refresh api fail');
//                 const params = JSON.parse(sessionStorage.getItem('iud'));
//                 console.log(params);
//                 this.initiateUser(params);
//                 // this.member.initiateUser(params);
//             }
//         }
//     }
// }

// export default TokenManager;
