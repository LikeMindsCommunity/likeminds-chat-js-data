// NetworkLibrary.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import TokenManager from './tokenmanager';
import { environment } from '../../config.staging';

class NetworkLibrary {
    private tokenManager: TokenManager;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.tokenManager = new TokenManager();
        this.axiosInstance = axios.create();
        this.initializeInterceptors();
    }

    private initializeInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                return this.tokenManager.refreshInterceptor(config);
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return this.wrapResponse(response);
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    private wrapResponse(response: AxiosResponse) {
        console.log('=>>', response);
        return {
            data: response.data,
            status: response.status,
            headers: response.headers,
        };
    }

    public setAccessToken(accessToken: string) {
        this.tokenManager.setAccessToken(accessToken);
    }

    public setApiKey(xApiKey: string) {
        this.tokenManager.setApiKey(xApiKey);
    }
    public setPlatformCode(xPlatformCode: string) {
        this.tokenManager.setPlatformCode(xPlatformCode);
    }

    public setVersionCode(xVersionCode: number) {
        this.tokenManager.setVersionCode(xVersionCode);
    }
    public setSourceCode(xSourceCode: string) {
        this.tokenManager.setSourceCode(xSourceCode);
    }

    public get(url: string) {
        return this.axiosInstance.get(`${environment.apiUrl}${url}`);
    }

    public post(url: string, data: any) {
        return this.axiosInstance.post(`${environment.apiUrl}${url}`, data);
    }

    public put(url: string, data: any) {
        return this.axiosInstance.put(`${environment.apiUrl}${url}`, data);
    }

    public delete(url: string, data: any) {
        return this.axiosInstance.delete(`${environment.apiUrl}${url}`, data);
    }

    // Add other HTTP methods as needed
}

export default NetworkLibrary;
