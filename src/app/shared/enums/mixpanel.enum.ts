export enum MIXPANEL {
    WEB_PAGE_VIEW = 'Web page view',
    OTP_GENERATED = 'OTP Generated',
    LOGGED_IN = 'Logged in',
    OTP_VERIFIED = 'OTP Verfied',
    COUNTRY_CODES_CLICKED = 'Country codes clicked',
    SIGNED_UP = 'Signed up',
    USER_ACQUISITION = 'user_acquisition',
    CREATED_PROFILE = 'Created profile',
    ACCOUNT_MERGED_STARTED = 'Account merged started',
    ACCOUNT_MERGED_COMPLETED = 'Account merged completed',
    ENTERED_NEW_EMAIL = 'Entered new email',
    RESEND_VERIFICATION_CODE = 'Resend Verfication code',
    COMMUNITY_JOIN_BACK_BUTTON = 'Community join back button',
    LEAVE_WITHOUT_JOINING = 'Leave without joining',
    STAY = 'Stay',
    COMMUNITY_JOIN = 'Community join',
    COMMUNITY_JOIN_SKIPPED = 'Community join skipped',
    PENDING_REQUEST_DETAIL = 'Pending request detail',
    CONTINUE_JOIN_COMMUNITY = 'Continue to join community',
    DOWNLOAD_APP = 'Download app button',
    MEMBER_PROFILE_VIEW = 'Member profile view',
    MEMBER_PROFILE_QUESTION_CLICKED = 'Member profile question clicked',
    MEMBER_PROFILE_CHATROOM_FOLLOWED = 'Member profile chatroom followed',
    MEMBER_PROFILE_CHATROOM_CREATED = 'Member profile chatroom created',
    MEMBER_PROFILE_REPORT = 'Member profile report',
    MEMBER_PROFILE_REPORT_CONFIRMED = 'Member profile report confirmed',
    MEMBER_PROFILE_PICTURE_UPLOAD = 'Member profile picture upload',
    MEMBER_PROFILE_UPDATED = 'Member profile updated',
    MEMBER_PROFILE_EDIT = 'Member profile edit',
    COMMUNITY_JOINED = 'Community joined',
    COMMUNITY_JOIN_STATUS = 'Community join status',
    COMMUNITY_JOIN_NOT_COMPLETED = 'Community join not completed',
    CHATROOM_FOLLOWED = 'Chatroom followed',
    CHATROOM_CLICKED = 'Chatroom clicked',
    CHATROOM_FOLLOW_BEFORE_LOGIN = 'Chatroom follow before login',
    CHATROOM_UNFOLLOWED = 'Chatroom unfollowed',
    CHATROOM_RESPONDED = 'Chatroom responded',
    CHATROOM_MUTED = 'Chatroom muted',
    USER_TAGS_SOMEONE = 'User tags someone',
    CHATROOM_REPORTED = 'Chatroom reported',
    CHATROOM_CREATION_COMPLETED = 'Chatroom creation completed',
    EVENT_ATTENDED = 'Event attended',
    POLL_VOTED = 'Poll voted',
    COMMUNITY_SHARING_STARTED = 'Community sharing started',
    COMMUNITY_CREATION_STARTED = 'Community creation started',
    COMMUNITY_CREATION_COMPLETED = 'Community creation completed',
    COMMUNITY_DETAIL_PAGE = 'Community detail page',
    CHATROOM_OPENED = 'Chatroom opened',
    INTRODUCTION_OPENED = 'Introduction opened',
    INTRO_ROOM_OPENED = 'Intro room opened',
    ACTIVE_THREADS_OPENED = 'Active threads opened',
    CHATROOM_LINK_CLICKED = 'Chatroom link clicked',
    INTERNAL_COMMUNITY_LINK_CLICKED = 'Internal community link clicked',
    INTERNAL_CHATROOM_LINK_CLICKED = 'Internal chatroom link clicked',
    INTERNAL_DIRECTORY_LINK_CLICKED = 'Internal directory link clicked',
    VIEWED_DIRECTORY = 'Viewed directory',
    CLICKED_ON_FILTERS = 'Clicked on filters',
    FILTERS_CLEARED = 'Filters cleared',
    APPLIED_FILTERS = 'Applied filters',
    VIEWED_NO_MEMBER_SCREEN_FILTERS = 'Viewed no member screen filters',
    VIEWED_MEMBER_PROFILE = 'Viewed member profile',
    MARK_CHATROOM_ACTIVE = 'Mark chatroom active',
    MARK_CHATROOM_INACTIVE = 'Mark chatroom inactive',
    VIEW_COMMUNITY = 'View community',
    CHATROOM_CREATION_STARTED = 'Chatroom creation started',
    PARTICIPANTS_ADDED = 'Participants added',
    MEMBER_ADDED = 'Member added',
    PARTICIPANTS_REMOVED = 'Participant removed',
    CHATROOM_LEFT = 'Chatroom left',
    CHATROOM_RENAMED = 'Chatroom renamed',
    CHATROOM_DELETED = 'Chatroom deleted',
    MEMBER_MESSAGE_SETTING = 'Member message setting',

    // ___Message Reactions___
    EMOTICON_TRAY_OPENED = 'Emoticon Tray Opened',
    REACTION_ADDED = 'Reaction Added',
    REACTION_LIST_OPENED = 'Reaction List Opened',
    REACTION_REMOVED = 'Reaction Removed',

    // ____Single event____
    EVENT_CREATED = 'Event created',
    EVENT_UPDATED = 'Event updated',
    EVENT_TAB_OPENED = 'Event tab opened',
    EVENT_OPENED = 'Event opened',
    EVENT_RECORDINGS_ADDED = 'Event recordings added',
    EVENT_RECORDINGS_EDITED = 'Event recordings edited',
    EVENT_RECORDINGS_VIEWED = 'Event recordings viewed',

    //Voice Notes
    VOICE_MESSAGE_RECORDED = 'Voice message recorded',
    VOICE_MESSAGE_PREVIEWED = 'Voice message previewed',
    VOICE_MESSAGE_CANCELLED = 'Voice message cancelled',
    VOICE_MESSAGE_SENT = 'Voice message sent',
    VOICE_MESSAGE_PLAYED = 'Voice message played',
}

// -------------- SUBSCRIPTION EVENTS-------------- //

export enum INVITATION_FLOW {
    COMMUNITY_SHARING_STARTED = 'Community sharing started',
}

export enum JOIN_FLOW {
    EXPLORE_COMMUNITIES = 'Explore communities',
    CANCEL_MEMBERSHIP_REQUEST = 'Cancel membership request',
    AUTOMATIC_OTL_VERIFICATION_TRIED = 'Automatic OTL verification tried',
    MANUAL_OTL_VERIFICATION_TRIED = 'Manual OTL verification tried',
}

export enum INVITE_FLOW {
    FREE_MEMBER_INVITED = 'FREE MEMBER INVITED',
    PAID_MEMBER_INVITED = 'PAID MEMBER INVITED',
}

export enum RENEWAL_FLOW {
    RENEWAL_BUTTON_CLICKED = 'Renew button clicked',
    SUBSCRIPTION_PLAN_PAGE_OPEN = 'Subscription plan page open',
    BUY_NOW_CLICKED = 'Buy now clicked',
    PAYMENT_FAILED = 'Payment failed',
    PAYMENT_SUCCESSFUL = 'Payment successful',
    MY_SUBSCRIPTIONS_CLICKED = 'My subscriptions clicked',
    LEAVE_COMMUNITY = 'Leave community',
}

export enum MY_SUBSCRIPTIONS {
    SUBSCRIPTION_HISTORY_CLICKED = 'Subscription history button clicked',
    GET_IN_TOUCH = 'Get in touch clicked',
    REFER_BUTTON_CLICKED = 'Refer button clicked',
    REFERRAL_INVITE_SHARED = 'Referral invite shared',
}

//////////////////////////////////////////////////////////////////

export enum JOIN_SOURCE {
    COMMUNITY_JOIN_NORMAL = 'community_join_normal',
    COMMUNITY_JOIN_PRIVATE_LINK = 'community_join_private_link',
    COMMUNITY_JOIN_PUBLIC_LINK = 'community_join_public_link',
    COMMUNITY_JOIN_DIRECTORY = 'community_join_directory',
    COMMUNITY_JOIN_CHATROOM = 'community_join_chatroom',
}

export enum SOURCE {
    CHATROOM_FEED = 'chatroom_feed',
    CHATROOM = 'chatroom',
    COMMUNITY_DETAIL = 'community_detail',
    ADD_PROMOTER = 'add_promoter',
    MEMBER_DIRECTORY = 'member_directory',
    MEMBER_PENDING = 'member_pending',
    MEMBER_PROFILE_PAGE = 'member_profile_page',
    HOME_FEED = 'home_feed',
    ROUTE = 'route',
    INTRO_ROOM_EDIT = 'intro_room_edit',
    UPDATE_PROFILE_COMMUNITY_DETAIL = 'update_profile_community_detail',
}

export enum LANDING_TYPE {
    COMMUNITY_JOIN = 'community_join',
    COMMUNITY_DETAIL = 'community_detail',
    MEMBER_PROFILE = 'member_profile',
    CHATROOM_JOIN = 'chatroom_join',
    DIRECTORY_LINK = 'directory_link',
}

export enum LINK_TYPE {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PRIVATE_ACTIVE = 'private active',
    PRIVATE_EXPIRED = 'private expired',
}

export enum SOCIAL_LOGIN_TYPE {
    FACEBOOK = 'facebook',
    GMAIL = 'gmail',
    LINKEDIN = 'linkedin',
}

export enum PRIVATE_LINK_STATUS {
    VALID = 'valid',
    EXPIRED = 'expired',
}

export enum CHATROOM_TYPE {
    NORMAL = 'normal',
    INTRO = 'intro',
    EVENT = 'event',
    POLL = 'poll',
    PUBLIC_EVENT = 'public event',
    PURPOSE = 'purpose',
}

export enum DOWNLOAD_BUTTON_SOURCE {
    TOP_BAR = 'top_bar',
    BOTTOM_BAR = 'bottom_bar',
    POPUP = 'pop_up',
}

export enum DOWNLOAD_BUTTON_TYPE {
    ANDROID = 'android',
    IOS = 'iOS',
    GENERAL = 'general',
}

export enum CHATROOM_FOLLOW_SOURCE {
    TAGGED_AUTO_FOLLOWED = 'tagged_auto_followed',
    CHATROOM_OVERFLOW_MENU = 'chatroom_overflow_menu',
    CHATROOM_TELESCOPE = 'chatroom_telescope',
    COMMUNITY_FEED = 'community_feed',
}

// RENEWAL FLOW

export enum RENEWAL_BUTTON_CLICKED {
    COMMUNITY_ID = 'community_id',
    COMMUNITY_NAME = 'community_name',
    SOURCE = 'source',
    MEMBERSHIP_STATE = 'membership_state',
}

export enum SUBSCRIPTION_PLAN_PAGE_OPEN {
    COMMUNITY_ID = 'community_id',
    COMMUNITY_NAME = 'community_name',
    PAGE_TYPE = 'page_type',
}

export enum BUY_NOW_CLICKED {
    COMMUNITY_ID = 'community_id',
    COMMUNITY_NAME = 'community_name',
    PLAN_DURATION = 'plan_duration',
}

export enum PAYMENT_FAILED {
    COMMUNITY_ID = 'community_id',
    PLAN_DURATION = 'plan_duration',
    PLAN_NAME = 'plan_name',
    PLAN_COST = 'plan_cost',
    PAYMENT_LINK = 'payment_link',
    PAYMENT_TYPE = 'payment_type',
}

export enum PAYMENT_SUCCESSFUL {
    COMMUNITY_ID = 'community_id',
    PLAN_DURATION = 'plan_duration',
    PLAN_NAME = 'plan_name',
    PLAN_COST = 'plan_cost',
    PAYMENT_LINK = 'payment_link',
    PAYMENT_TYPE = 'payment_type',
}

// MY SUBSCRIPTION (FIRE AN EVENT)

export enum LEAVE_COMMUNITY {}

// Chatroom configurations

export enum CHATROOM_CONFIGURATIONS {
    MEMBER_GROUP_CREATION_STARTED = 'Member group creation started',
    MEMBER_GROUP_NAME_UPDATED = 'Member group name updated',
    MEMBER_LIST_UPDATED = 'Member list updated',
}
