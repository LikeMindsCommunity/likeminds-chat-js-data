export const API = {
    SDK_RESOURCE: '/sdk/initiate',
    REFRESH_TOKEN_API: '/user/refresh',
    MY_CHATOOMS: '/chatroom/mine',
    CHATROOM_FETCH: '/chatroom',
    CONVERSATION_FETCH: '/conversation', //(GET)
    CONVERSATION_CREATE: '/conversation', //(POST)
    CONVERSATION_ADD_ACTION: '/conversation/reaction', //(PUT)
    CHATROOM_GET_TAGGINNG_LIST: '/chatroom/tag', //(GET)
    FETCH_REPORT_TAGS: '/community/report/tag', //(GET)
    PUSH_REPORT: '/community/report', //(POST)
    COLLABCARD_FOLLOW: '/chatroom/follow', //(PUT)
    MEMBER_STATE: '/community/member/state', //(GET)
    // COMMUNITY_MEMBER_FETCH_FEED: '/community/feed', //(GET)
    COMMUNITY_MEMBER_FETCH_FEED: '/community_member/fetch_feed',
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

    FETCH_CHATROOM_HOME: '/community_member/fetch_chatroom_home',
    MARK_READ: '/mark_read',
    UPLOAD_FILES: '/v1/upload_files',
};
// export const API = {
//     SDK_RESOURCE: '/sdk/initiate',
//     REFRESH_TOKEN_API: '/user/refresh',
//     MY_CHATOOMS: '/v1/my_chatrooms', = "/chatroom/mine"
//     CHATROOM_FETCH: '/chatroom/fetch', "/chatroom"
//     CONVERSATION_FETCH: '/conversation/fetch', "/conversation(GET)"
//     CONVERSATION_CREATE: '/conversation/create', "/conversation(POST)"
//     CONVERSATION_ADD_ACTION: '/conversation/add_reaction', "/conversation/reaction(PUT)"
//     CHATROOM_GET_TAGGINNG_LIST: '/chatroom/get_tagging_list', "/chatroom/tag(GET)"
//     FETCH_REPORT_TAGS: '/fetch_report_tags', "/community/report/tag(GET)"
//     PUSH_REPORT: '/push_report', "/community/report(POST)"
//     COLLABCARD_FOLLOW: '/collabcard_follow', "/chatroom/follow(PUT)"
//     MEMBER_STATE: '/members_state', "/community/member/state(GET)"
//     COMMUNITY_MEMBER_FETCH_FEED: '/community_member/fetch_feed', "/community/feed(GET)"
//     ALL_MEMBERS: '/v1/all_members', "/community/member(GET)"
//     // DM_ALL_MEMBERS: '/v1/all_members',
//     DM_ALL_MEMBERS: '/community/member',
//     COLLABCARD_SEEN: '/collabcard_seen', "/chatroom/seen(PUT)"
//     FETCH_DM_FEED: '/user/fetch_dm_feed', "/community/dm/feed(GET)"
//     CAN_DM: '/community_member/can_dm', "/community/dm/status(GET)"
//     FETCH_DM_CHATROOMS: '/community_member/fetch_dm_chatrooms', "/chatroom/dm(GET)"
//     REQUEST_DM_LIMIT: '/community_member/request_dm_limit', "/chatroom/dm/limit(GET)"
//     CHATROOM_CREATE_DM: '/chatroom/create_dm', "/chatroom/dm/create(POST)"
//     CHATROOM_REQUEST_DM: '/chatroom/request_dm', "/chatroom/dm/request(POST)"
//     CHATROOM_BLOCK: '/chatroom/block', "/chatroom/dm/block(POST)"
//     CONVERSATION_META: '/conversation_meta', "/conversation(GET)"
//     HOME_COMMUNITIES: '/community_member/home_communities', "/home/fetch_communities(POST)"

//     FETCH_CHATROOM_HOME: '/community_member/fetch_chatroom_home',
//     MARK_READ: '/mark_read',
//     UPLOAD_FILES: '/v1/upload_files',
// };
