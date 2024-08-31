import { Base } from './base';
import { HomeFeedClient } from './pages/home-feed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member } from './pages/user';
import { DirectMessage } from './pages/direct-message';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';
import { PollClient } from './pages/poll';
import { CoreServices } from './pages/core-services';
import { LMSDKCallbacks } from './LMCallback';

class SDKBuilder {
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    lmsCallbacks: LMSDKCallbacks | null;

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
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
        });
    }
}

class LMChatClient extends Base {
    static xPlatformCode: string;
    static xVersionCode: number;
    static xSdkSource: string;
    static lmsCallbacks: LMSDKCallbacks | null;
    private giphyApiKey: string = '9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR';
    public setGipghyApiKey(apiKey: string) {
        this.giphyApiKey = apiKey;
    }
    public getGiphyApiKey() {
        return this.giphyApiKey;
    }
    public getNetworkLibrary() {
        return this.networkLibrary;
    }
    
    static setLMSDKCallbacks(callback: LMSDKCallbacks) {
        this.lmsCallbacks = callback;
        // return this;
    }

    static setPlatformCode(xplatformcode: string): SDKBuilder {
        this.xPlatformCode = xplatformcode;
        return this;
    }

    static setVersionCode(xversioncode: number): SDKBuilder {
        this.xVersionCode = xversioncode;
        return this;
    }

    static build() {
        return new LMChatClient({
            // xApiKey: this.xApiKey,
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
            // lmCallback: this.lmsCallbacks,
        });
    }
}
export default LMChatClient;
export { LMSDKCallbacks };
interface LMChatClient extends HomeFeedClient, PollClient, ChatroomData, ExploreFeed, Member, DirectMessage, Search, CoreServices {}

applyMixins(LMChatClient, [HomeFeedClient, PollClient, ChatroomData, ExploreFeed, Member, DirectMessage, Search, CoreServices]);
