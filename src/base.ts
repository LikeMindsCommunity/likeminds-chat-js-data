import NetworkLibrary from './core/services/networklibrary';
import { API } from './shared/constants/api.constant';
import { InitUser, SdkConfig } from './shared/types';

export abstract class Base {
    xApiKey: string;
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;

    constructor(sdkConfig: SdkConfig) {
        this.xApiKey = sdkConfig.xApiKey;
        this.xPlatformCode = sdkConfig.xPlatformCode;
        this.xVersionCode = sdkConfig.xVersionCode;
        this.xSdkSource = sdkConfig.xSdkSource;
    }

    initiateUser(initUser: InitUser): Promise<any> {
        const networkLibrary = new NetworkLibrary();
        networkLibrary.setApiKey(this.xApiKey);
        networkLibrary.setPlatformCode(this.xPlatformCode);
        networkLibrary.setVersionCode(this.xVersionCode);
        networkLibrary.setSourceCode(this.xSdkSource);

        const params = {
            is_guest: initUser?.isGuest,
            user_unique_id: initUser?.userUniqueId,
            user_name: initUser?.userName,
        };

        return networkLibrary
            .post(`${API.SDK_INITIATE}`, params)
            .then((resData: any) => {
                console.log('Init res=> ', resData);
                // Set the access token
                const accessToken = resData.data.data.access_token;
                networkLibrary.setAccessToken(accessToken);
                return resData.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

// export class SDKBuilder {
//     xApiKey: string;
//     xPlatformCode: string;
//     xVersionCode: string;

//     setApiKey(xapikey: string): SDKBuilder {
//         this.xApiKey = xapikey;
//         return this;
//     }

//     setPlatformCode(xplatformcode: string): SDKBuilder {
//         this.xPlatformCode = xplatformcode;
//         return this;
//     }

//     setVersionCode(xversioncode: string): SDKBuilder {
//         this.xVersionCode = xversioncode;
//         return this;
//     }

//     build() {
//         return new InitiateSdk(this);
//     }
// }
