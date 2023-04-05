import fetch from 'isomorphic-unfetch';
import { API } from './shared/api.constant';

type Config = {
    apiKey: string;
    userId?: any;
    baseUrl?: string;
    baseUrlCaravan?: string;
    xPlatformCode?: any;
    xVersionCode?: any;
    xDeviceId?: any;
};

export abstract class Base {
    private apiKey: string;
    private baseUrl: string;
    private baseUrlCaravan: string;
    private xMemberId: string;
    private xPlatformCode: string;
    private xVersionCode: string;
    private xDeviceId: string;

    constructor(congif: Config) {
        this.apiKey = congif.apiKey;
        this.baseUrl = congif.baseUrl || 'https://auth.likeminds.community';
        this.baseUrlCaravan = congif.baseUrlCaravan || 'https://www.likeminds.community';
        this.xPlatformCode = congif.xPlatformCode || 'web';
        this.xVersionCode = congif.xVersionCode || 20;
        this.xMemberId = congif?.userId;
        this.xDeviceId = congif?.xDeviceId;
    }

    protected invoke<T>(endpoint: string, options?: RequestInit): Promise<T> {
        let headers: any;
        headers = {
            'Content-Type': 'application/json',
            'x-platform-code': this.xPlatformCode,
            'x-api-key': this.apiKey,
            'x-version-code': this.xVersionCode,
        };

        const kettle = endpoint.includes('initiate');

        const isRefreshRequest = endpoint.includes('refresh');
        const carvanApi =
            endpoint.includes('likemind') ||
            endpoint.includes('mark_read') ||
            endpoint.includes('secret/leave') ||
            endpoint.includes('upload_files');
        // endpoint.includes('fetch_chatroom_home') ||

        const cFeed = endpoint.includes('community/feed');

        let url = `${this.baseUrl}${endpoint}`;
        if (carvanApi) url = `${this.baseUrlCaravan}/api${endpoint}`;

        const userData = JSON.parse(localStorage.getItem('__likeminds_user__'));

        if (carvanApi) headers['x-member-id'] = userData?.id;
        if (cFeed) headers['x-accept-version'] = 'v2';

        if (!kettle && !isRefreshRequest) headers['Authorization'] = `Bearer ${localStorage.getItem('__access_token_LTM__')}`;

        const isMarkRead = endpoint.includes('mark_read');
        if (isMarkRead) headers['Content-Type'] = 'application/x-www-form-urlencoded';

        const userDevicePush = endpoint.includes('/user/device/push');
        if (userDevicePush) headers['x-device-id'] = this.xDeviceId;

        const config = { ...options, headers };

        // Retry api call after refresh token expired.
        function tryRequest(url: any, config: any) {
            return fetch(url, config)
                .then((response) => response.json())
                .then((response) => {
                    return response.data;
                })
                .catch((err) => console.log(err));
        }

        // Return response to client
        if (carvanApi) {
            return fetch(url, config).then((response) => {
                if (response.ok) return response.json();
                else throw new Error(response.statusText);
            });
        } else {
            return fetch(url, config)
                .then((response) => response.json())
                .then((response: any) => {
                    // Get Refresh token
                    if (!response.success && response.error_message === 'Invalid LTM!') {
                        let options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('__refresh_token_RTM__')}`,
                            },
                        };
                        const refreshData = fetch(`${this.baseUrl}${API.REFRESH_TOKEN_API}`, options);
                        refreshData
                            .then((response) => response.json())
                            .then((resData: any) => {
                                localStorage.setItem('__access_token_LTM__', resData.data.access_token);
                                headers['Authorization'] = `Bearer ${resData.data.access_token}`;
                                localStorage.setItem('__refresh_token_RTM__', resData.data.refresh_token);
                                tryRequest(url, config);
                            });
                    } else if (!response.success && response.error_message === 'Invalid RTM!') localStorage.clear();
                    else return response?.data || response;
                })
                .catch((err) => {
                    throw new Error(err?.statusText);
                });
        }
    }
}
