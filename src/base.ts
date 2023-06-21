import LMChatClient from 'src';
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

export class SDKBuilder {
    xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;

    setApiKey(xapikey: string): SDKBuilder {
        this.xApiKey = xapikey;
        return this;
    }

    setPlatformCode(xplatformcode: string): SDKBuilder {
        this.xPlatformCode = xplatformcode;
        return this;
    }

    setVersionCode(xversioncode: number): SDKBuilder {
        this.xVersionCode = xversioncode;
        return this;
    }

    build() {
        return new LMChatClient({
            xApiKey: this.xApiKey,
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
        });
    }
}
