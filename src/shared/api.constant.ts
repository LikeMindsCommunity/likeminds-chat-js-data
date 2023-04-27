export const API = {
    SDK_INITIATE: '/sdk/initiate',
    CHATROOM_MINE: '/chatroom/mine',
    COMMUNITY_FEED: '/community/feed',
    CHATROOM: '/chatroom',
    CHATROOM_FOLLOW: '/chatroom/follow',
    CHATROOM_MUTE: '/chatroom/mute',
    CHATROOM_MARK_READ: '/chatroom/mark_read',
    CHATROOM_SHARED: '/chatroom/share',
    CONVERSATION_TOPIC: '/conversation/topic',
    COMMUNITY_TAG: '/community/tag',
    CONVERSATION: '/conversation', //(GET)

    REFRESH_TOKEN_API: '/user/refresh',
    CONVERSATION_FETCH: '/conversation', //(GET)
    CONVERSATION_CREATE: '/conversation', //(POST)
    CONVERSATION_ADD_ACTION: '/conversation/reaction', //(PUT)
    CHATROOM_GET_TAGGINNG_LIST: '/chatroom/tag', //(GET)
    FETCH_REPORT_TAGS: '/community/report/tag', //(GET)
    PUSH_REPORT: '/community/report', //(POST)
    CHATROOM_SECRET_LEAVE: '/chatroom/secret/leave', //(Post)
    MEMBER_STATE: '/community/member/state', //(GET)
    ALL_MEMBERS: '/community/member', //(GET)
    COMMUNITY_MEMBER_SEARCH: '/community/member/search', //(GET)
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
    FETCH_CHATROOM_HOME: '/chatroom/home',
    MARK_READ: '/mark_read',
    UPLOAD_FILES: '/v1/upload_files',
    HELPER_MEDIA_UPLOAD: '/helper/media/upload',
    COMMUNITY_MEMBER_PROFILE: '/community/member/profile',
    SEARCH_CHATROOM: '/chatroom/search',
    CHANNEL_INVITES: '/channel/invites', // (GET)
    CHANNEL_INVITE: '/channel/invite', // (PUT)
    CHATROOM_PARTICIPANTS: '/chatroom/participants',
    USER_DEVICE_PUSH: '/user/device/push',
};
