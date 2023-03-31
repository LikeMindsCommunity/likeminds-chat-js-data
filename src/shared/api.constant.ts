export const API = {
    SDK_RESOURCE: '/sdk/initiate',
    REFRESH_TOKEN_API: '/user/refresh',
    MY_CHATOOMS: '/chatroom/mine', //(GET)
    CHATROOM_FETCH: '/chatroom',
    CONVERSATION_FETCH: '/conversation', //(GET)
    // CONVERSATION_CREATE: '/conversation/create', //(POST)
    CONVERSATION_CREATE: '/conversation', //(POST)
    CONVERSATION_ADD_ACTION: '/conversation/reaction', //(PUT)
    CHATROOM_GET_TAGGINNG_LIST: '/chatroom/tag', //(GET)
    FETCH_REPORT_TAGS: '/community/report/tag', //(GET)
    PUSH_REPORT: '/community/report', //(POST)
    COLLABCARD_FOLLOW: '/chatroom/follow', //(PUT)
    CHATROOM_SECRET_LEAVE: '/chatroom/secret/leave', //(Post)
    MEMBER_STATE: '/community/member/state', //(GET)
    COMMUNITY_MEMBER_FETCH_FEED: '/community/feed',
    ALL_MEMBERS: '/community/member', //(GET)
    DM_ALL_MEMBERS: '/community/member', //(GET)
    COLLABCARD_SEEN: '/chatroom/seen', //(PUT)
    FETCH_DM_FEED: '/community/dm/feed', //(GET)
    CAN_DM: '/community/dm/status', //(GET)
    FETCH_DM_CHATROOMS: '/chatroom/dm', //(GET)
    REQUEST_DM_LIMIT: '/chatroom/dm/limit', //(GET)
    CHATROOM_CREATE_DM: '/chatroom/dm/create', // Post
    CHATROOM_REQUEST_DM: '/chatroom/dm/request', //(POST)
    CHATROOM_BLOCK: '/chatroom/dm/block', //(POST)
    CONVERSATION_META: '/conversation', //(GET)
    HOME_COMMUNITIES: '/home/fetch_communities', //(POST)
    // FETCH_CHATROOM_HOME: '/community_member/fetch_chatroom_home',
    FETCH_CHATROOM_HOME: '/chatroom/home',
    MARK_READ: '/mark_read',
    CHATROOM_MARK_READ: '/chatroom/mark_read',
    UPLOAD_FILES: '/v1/upload_files',
    HELPER_MEDIA_UPLOAD: '/helper/media/upload',
    COMMUNITY_MEMBER_PROFILE: '/community/member/profile',
    SEARCH_CHATROOM: '/chatroom/search',
    CHATROOM_MUTE: '/chatroom/mute',
    CHANNEL_INVITES: '/channel/invites', // (GET)
    CHANNEL_INVITE: '/channel/invite', // (PUT)
    CHATROOM_PARTICIPANTS: '/chatroom/participants',
    USER_DEVICE_PUSH: '/user/device/push',
};
