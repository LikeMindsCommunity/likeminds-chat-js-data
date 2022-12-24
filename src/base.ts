import fetch from 'isomorphic-unfetch';

type Config = {
    apiKey: string;
    baseUrl?: string;
    xMemberId?: any;
    xPlatformCode?: any;
    xVersionCode?: any;
};

export abstract class Base {
    private apiKey: string;
    private baseUrl: string;
    private xMemberId: string;
    private xPlatformCode: string;
    private xVersionCode: string;

    constructor(congif: Config) {
        this.apiKey = congif.apiKey;
        this.baseUrl = congif.baseUrl;
        this.xMemberId = congif.xMemberId;
        this.xPlatformCode = congif.xPlatformCode;
        this.xVersionCode = congif.xVersionCode;
    }

    protected invoke<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const isMarkRead = endpoint.includes('mark_read');
        let headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'x-member-id': this.xMemberId,
            'x-platform-code': this.xPlatformCode,
            'x-version-code': this.xVersionCode,
        };

        if (isMarkRead) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        const config = {
            ...options,
            headers,
        };

        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        });
    }
}
