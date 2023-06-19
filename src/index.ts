import { Base, SDKBuilder } from './base';
import { HomeFeedClient } from './pages/home-feed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member } from './pages/user';
import { DirectMessage } from './pages/direct-message';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';
import MemberState from './pages/user/initUser';

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
interface LMChatClient extends HomeFeedClient, MemberState, ChatroomData, ExploreFeed, Member, DirectMessage, Search {}

applyMixins(LMChatClient, [HomeFeedClient, MemberState, ChatroomData, ExploreFeed, Member, DirectMessage, Search]);

export default LMChatClient;

// const a = LMChatClient.setApiKey('3223').setPlatformCode('33').setVersionCode(0).build();
