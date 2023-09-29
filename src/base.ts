import { SdkConfig } from './shared/types';
import NetworkLibrary from './core/services/networklibrary';

export class Base {
    xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    networkLibrary = new NetworkLibrary();

    constructor(sdkConfig: SdkConfig) {
        this.xApiKey = sdkConfig.xApiKey;
        this.xPlatformCode = sdkConfig.xPlatformCode;
        this.xVersionCode = sdkConfig.xVersionCode;

        this.networkLibrary.setApiKey(this.xApiKey);
        this.networkLibrary.setPlatformCode(this.xPlatformCode);
        this.networkLibrary.setVersionCode(this.xVersionCode);
    }
}