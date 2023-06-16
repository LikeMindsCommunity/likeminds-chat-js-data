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
        const dataField: any = response.data;
        console.log('response object ==> ', response);
        console.log('dataField ==> ', dataField);
        let containsAnotherData = Object.keys(dataField).includes('data');
        console.log('contains another data ==> ', containsAnotherData);
        if (containsAnotherData) {
            let wrapper = {
                data: dataField.data,
                success: response.status,
                headers: response.headers,
            };
            console.log('wrapper is ==> ', wrapper);
            return wrapper;
        } else {
            let wrapper = {
                data: dataField,
                success: response.status,
                headers: response.headers,
            };
            console.log('wrapper is ==> ', wrapper);
            return wrapper;
        }
    }

    public setAccessToken(accessToken: string) {
        this.tokenManager.setAccessToken(accessToken);
    }

    public setRefreshToken(refreshToken: string) {
        this.tokenManager.setRefreshToken(refreshToken);
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
