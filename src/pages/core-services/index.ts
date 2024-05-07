import { AxiosRequestConfig } from 'axios';
import { Base } from '../../base';
import NetworkLibrary from '../../core/services/networklibrary';

// CoreServices.ts
export class CoreServices extends Base {
    public networkLibrary = new NetworkLibrary();

    async makeAuthenticatedRequest(url: string, config?: AxiosRequestConfig) {
        return config ? this.networkLibrary.makeAuthenticatedRequest(url, config) : this.networkLibrary.makeAuthenticatedRequest(url);
    }
}
