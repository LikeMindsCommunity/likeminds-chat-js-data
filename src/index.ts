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
import { Member, MemberAction, SDKClientInfo } from './shared/interfaces/Member';
import { Attachment, AttachmentMeta } from './shared/interfaces/Attachment';
import { Chatroom } from './shared/interfaces/Chatroom';
import { ChatroomAction } from './shared/interfaces/ChatroomActions';
import { Cohort } from './shared/interfaces/Cohort';
import { Community } from './shared/interfaces/Community';
import { Conversation } from './shared/interfaces/Conversation';
import { MemberRight } from './shared/interfaces/MemberRight';
import { OgTag } from './shared/interfaces/OgTag';
import { Poll } from './shared/interfaces/Poll';
import { Question } from './shared/interfaces/Question';
import { Reaction } from './shared/interfaces/Reaction';
import { ReportTag } from './shared/interfaces/ReportTagObject';
import { ModelConverter } from './utils/ModelConverter';

import { AddPollOptionResponse } from './shared/api-responses/AddPollOption';
import { BlockMemberResponse } from './shared/api-responses/BlockMember';
import { CheckDMLimitResponse } from './shared/api-responses/CheckDMLimit';
import { CheckDMStatusResponse } from './shared/api-responses/CheckDMStatus';
import { CheckDMTabResponse } from './shared/api-responses/CheckDMTab';
import { CreateDMChatroomResponse } from './shared/api-responses/CreateDMChatroom';
import { DeleteConversationResponse } from './shared/api-responses/DeleteConversation';
import { EditConversationResponse } from './shared/api-responses/EditConversation';
import { GetChatroomResponse } from './shared/api-responses/getChatroomResponse';
import { SyncChatroomResponse } from './shared/api-responses/getChatroomSync';
import { GetExploreFeedResponse } from './shared/api-responses/getExploreChatroomsResponse';
import { GetMemberStateResponse } from './shared/api-responses/getMemberStateResponse';
import { DecodeURLResponse } from './shared/api-responses/getOgTagResponse';
import { GetPollUsersResponse } from './shared/api-responses/GetPollUsers';
import { GetReportTagsResponse } from './shared/api-responses/getReportTagsResponse';
import { SyncConversationResponse } from './shared/api-responses/getSyncConversationsResponse';
import { GetTaggingListResponse } from './shared/api-responses/getTaggingListResponse';
import { ValidateUser } from './shared/api-responses/initiateUserResponse';
import { PostConversationResponse } from './shared/api-responses/postConversationResponse';
import { SearchChatroomsResponse } from './shared/api-responses/SearchChatroom';
import { SearchConversationsResponse } from './shared/api-responses/SearchConversation';
import { SendDMRequestResponse } from './shared/api-responses/SendDMRequest';
import { ViewParticipantsResponse } from './shared/api-responses/viewParticipants';
import LMResponseType from './LMResponse';
import { ConversationState } from './shared/enums/conversationstate';
import { MemberRole } from './shared/enums/Roles';
import { GetAIChatbotsResponse } from './shared/api-responses/GetAIChatbotsResponse';
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
    static excludedConversationStates: number[] = []; // Set default to an empty array
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

    static setPlatformCode(xPlatformCode: string): SDKBuilder {
        this.xPlatformCode = xPlatformCode;
        if (xPlatformCode === 'rt') {
            ModelConverter.platformCode = 'rt';
        }
        return this;
    }

    static setExcludedConversationStates(excludedConversationStates: number[] = []): SDKBuilder {
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
    AddPollOptionResponse as AddPollOption,
    BlockMemberResponse as BlockMember,
    CheckDMLimitResponse as CheckDMLimit,
    CheckDMStatusResponse as CheckDMStatus,
    CheckDMTabResponse as CheckDMTab,
    CreateDMChatroomResponse as CreateDMChatroom,
    DeleteConversationResponse as DeleteConversation,
    EditConversationResponse as EditConversation,
    GetChatroomResponse as GetChatroom,
    SyncChatroomResponse as GetHomeFeed,
    GetExploreFeedResponse as GetExploreChatrooms,
    GetMemberStateResponse as GetMemberState,
    DecodeURLResponse as GetOgTag,
    GetPollUsersResponse as GetPollUsers,
    GetReportTagsResponse as GetReportTags,
    SyncConversationResponse as GetConversation,
    GetTaggingListResponse as GetTaggingList,
    ValidateUser,
    PostConversationResponse as PostConversation,
    SearchChatroomsResponse as SearchChatrooms,
    SearchConversationsResponse as SearchConversations,
    SendDMRequestResponse as SendDMRequest,
    ViewParticipantsResponse as ViewParticipants,
    LMResponseType as LMResponseType,
    GetAIChatbotsResponse,
};
export {
    LMSDKCallbacks,
    Member,
    Attachment,
    AttachmentMeta,
    Chatroom,
    ChatroomAction as ChatroomActions,
    Cohort,
    Community,
    Conversation,
    MemberRight,
    OgTag,
    Poll,
    Question,
    Reaction,
    ReportTag as ReportTagObject,
    SDKClientInfo,
    MemberAction as MemberActions,

    // Enums
    MemberRole,
    ConversationState,
};

interface LMChatClient extends HomeFeedClient, PollClient, ChatroomData, ExploreFeed, MemberClient, DirectMessage, Search, CoreServices {}

applyMixins(LMChatClient, [HomeFeedClient, PollClient, ChatroomData, ExploreFeed, MemberClient, DirectMessage, Search, CoreServices]);
