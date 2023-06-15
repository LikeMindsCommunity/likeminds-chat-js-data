import { Base, SDKBuilder } from './base';
import { HomeFeedClient } from './pages/homefeed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member } from './pages/user';
import { DmFeed } from './pages/directmessage';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';

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
interface LMChatClient extends HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search {}

applyMixins(LMChatClient, [HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search]);

export default LMChatClient;
