import LMChatClient from 'src';
import NetworkLibrary from './core/services/networklibrary';
import { API } from './shared/constants/api.constant';
import { InitUser, SdkConfig } from './shared/types';

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
        this.xSdkSource = sdkConfig.xSdkSource;
    }

    setHeaderConfig() {
        this.networkLibrary.setApiKey(this.xApiKey);
        this.networkLibrary.setPlatformCode(this.xPlatformCode);
        this.networkLibrary.setVersionCode(this.xVersionCode);
        this.networkLibrary.setSourceCode(this.xSdkSource);
    }

    initiateUser(initUser: InitUser): Promise<any> {
        this.setHeaderConfig();
        const params = {
            is_guest: initUser?.isGuest,
            user_unique_id: initUser?.userUniqueId,
            user_name: initUser?.userName,
        };

        return this.networkLibrary
            .post(`${API.SDK_INITIATE}`, params)
            .then((resData: any) => {
                // Set the access token
                const accessToken = resData.data.data.access_token;
                this.networkLibrary.setAccessToken(accessToken);
                return resData.data;
            })
            .catch((error) => {
                console.log(error);
            });
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
