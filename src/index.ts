import { Base } from './base';
import { HomeFeedClient } from './pages/home-feed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member } from './pages/user';
import { DirectMessage } from './pages/direct-message';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';
import { PollClient } from './pages/poll';

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

class LMChatClient extends Base {
    static xApiKey: string;
    static xPlatformCode: string;
    static xVersionCode: number;
    static xSdkSource: string;
    static setApiKey(xapikey: string): SDKBuilder {
        this.xApiKey = xapikey;
        return this;
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
            xApiKey: this.xApiKey,
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
        });
    }
}
interface LMChatClient extends HomeFeedClient, PollClient, ChatroomData, ExploreFeed, Member, DirectMessage, Search {}

applyMixins(LMChatClient, [HomeFeedClient, PollClient, ChatroomData, ExploreFeed, Member, DirectMessage, Search]);

export default LMChatClient;
