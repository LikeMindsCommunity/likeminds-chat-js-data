import { Base } from './base';
import { HomeFeedClient } from './pages/home-feed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member as MemberClient } from './pages/user';
import { DirectMessage } from './pages/direct-message';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';
import { PollClient } from './pages/poll';
import { CoreServices } from './pages/core-services';
import { LMSDKCallbacks } from './LMCallback';
import { Member } from './shared/interfaces/Member';
import { Attachment, AttachmentMeta } from './shared/interfaces/Attachment';
import { Chatroom } from './shared/interfaces/Chatroom';
import { ChatroomActions } from './shared/interfaces/ChatroomActions';
import { Cohort } from './shared/interfaces/Cohort';
import { Community } from './shared/interfaces/Community';
import { Conversation } from './shared/interfaces/Conversation';
import { MemberRight } from './shared/interfaces/MemberRight';
import { OgTag } from './shared/interfaces/OgTag';
import { Poll } from './shared/interfaces/Poll';
import { Question } from './shared/interfaces/Question';
import { Reaction } from './shared/interfaces/Reaction';
import { ReportTagObject } from './shared/interfaces/ReportTagObject';
import { ModelConverter } from './utils/ModelConverter';

class SDKBuilder {
    xPlatformCode: string;
    xVersionCode: number;
    xSdkSource: string;
    excludedConversationStates: any = null; // Set default value to null
    lmsCallbacks: LMSDKCallbacks | null;

    setPlatformCode(xplatformcode: string): SDKBuilder {
        this.xPlatformCode = xplatformcode;
        return this;
    }

    setVersionCode(xversioncode: number): SDKBuilder {
        this.xVersionCode = xversioncode;
        return this;
    }

    setExcludedConversationStates(excludedConversationStates: any): SDKBuilder {
        this.excludedConversationStates = excludedConversationStates;
        return this;
    }

    build() {
        return new LMChatClient({
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
            excludedConversationStates: this.excludedConversationStates ?? [], // Ensure a default value if undefined
        });
    }
}

class LMChatClient extends Base {
    static xPlatformCode: string;
    static excludedConversationStates: any = []; // Set default to an empty array
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
    }

    static setPlatformCode(xplatformcode: string): SDKBuilder {
        this.xPlatformCode = xplatformcode;
        if (xplatformcode === 'rt') {
            ModelConverter.platformCode = 'rt';
        }
        return this;
    }

    static setExcludedConversationStates(excludedConversationStates: any = []): SDKBuilder {
        this.excludedConversationStates = excludedConversationStates;
        return this;
    }

    static setVersionCode(xversioncode: number): SDKBuilder {
        this.xVersionCode = xversioncode;
        return this;
    }

    static build() {
        return new LMChatClient({
            xPlatformCode: this.xPlatformCode,
            xVersionCode: this.xVersionCode!,
            xSdkSource: this.xSdkSource,
            excludedConversationStates: this.excludedConversationStates ?? [], // Use default if not set
        });
    }
}

export default LMChatClient;
export {
    LMSDKCallbacks,
    Member,
    Attachment,
    AttachmentMeta,
    Chatroom,
    ChatroomActions,
    Cohort,
    Community,
    Conversation,
    MemberRight,
    OgTag,
    Poll,
    Question,
    Reaction,
    ReportTagObject,
};

interface LMChatClient extends HomeFeedClient, PollClient, ChatroomData, ExploreFeed, MemberClient, DirectMessage, Search, CoreServices {}

applyMixins(LMChatClient, [HomeFeedClient, PollClient, ChatroomData, ExploreFeed, MemberClient, DirectMessage, Search, CoreServices]);
