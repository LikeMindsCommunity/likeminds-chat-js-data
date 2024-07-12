import NetworkLibrary from 'src/core/services/networklibrary';
import { Base } from 'src/base';
import { AxiosRequestConfig } from 'axios';

// CoreServices.ts
export class CoreServices extends Base {
    // public networkLibrary = new NetworkLibrary();

    async makeAuthenticatedRequest(url: string, config?: AxiosRequestConfig) {
        return config ? this.networkLibrary.makeAuthenticatedRequest(url, config) : this.networkLibrary.makeAuthenticatedRequest(url);
    }
}
