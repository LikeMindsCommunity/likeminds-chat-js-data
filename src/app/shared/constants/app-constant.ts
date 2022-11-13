export const MESSAGE = {
    OTP_RESENT: 'OTP Resent',
    NEW_OTP_SENT: 'New OTP Sent',
};

export const LEAVE_WITHOUT_JOINING = 'Leave without joining?';
export const LEAVE_WITHOUT_JOIN_TEXT =
    'You are just one step away from being part of this amazing community. Are you sure you want to leave without joining?';
export const MEMBER_DIRECTORY_HEADING = 'Member directory not accessible';
export const MEMBER_DIRECTORY_HEADING1 =
    'Your account is pending for approval from the community managers. Once a manager approves, you would be able to access the member directory and member profiles.';
export const MEMBER_PROFILE_HEADING = 'Member profile not accessible';
export const MEMBER_PROFILE_HEADING1 =
    "You cannot view other members' profiles until you are an approved member. The community manager(s) will notify you once you are approved.";
export const DOWNLOAD_APP_TEXT = 'Once verified, we will notify you. Meanwhile you can download our app.';
export const DOWNLOAD_APP_TEXT2 = 'Please download the app to see all the chat rooms and connect with the community.';
export const ANDROID = 'android';
export const IOS = 'iOS';
export const PLAYSTORE = 'playstore';
export const APPSTORE = 'appstore';
export const CHATROOM_TYPE_MAP = {
    0: 'normal',
    1: 'intro',
    2: 'event',
    3: 'poll',
    6: 'public_event',
    7: 'purpose',
    9: 'introduction_rooms',
};
export const CHATROOM_SOURCE = {
    home: 'home_feed',
    nofification: 'notification',
    community: 'community_feed',
    deep: 'deep_link',
    internal: 'internal_link',
    direct_message: 'dm',
};

export const OPEN_DOWNLOAD_POPUP = 'open_download_popup';
export const CHATROOM_DELETED_MESSAGE =
    'Oops! The chat room has been deleted. Don’t worry. You can still view and participate in other chat rooms after joining the community.';
export const CHATROOM_EXPIRED_MESSAGE =
    'Oops! The private link to participate in this chat room has expired. Continue to join the community and wait for promoter’s approval. Or, ask Nipun to resend a private invite link.';
export const CHATROOM_NOT_LOGGEDIN_MESSAGE =
    'You are trying to participate in private poll. Login and join the community and wait for the approval from a community manager. You would be able to participate once approved.';
export const CHATROOM_NON_MEMBER_MESSAGE =
    'You are trying to participate in private poll. Continue to join the community and wait for the approval from a community manager. You would be able to participate once approved.';
export const ERROR_906_TRY_AFTER_30_SECONDS = 'error | 906 | Please try after some time30 seconds';
export const AUTH_SCREEN_TYPE = {
    GENERATE_OTP: 'generate_otp',
    VERIFY_OTP: 'verify_otp',
    INVITE_ONLY: 'invite_only',
    WAITING_LIST: 'waiting_list',
    BLOCKER: 'blocker',
    HOME_FEED: 'home_feed',
    REGISTER: 'register',
};
export const CREATE_TYPE = {
    SELECT_COMMUNITY: 'Select Community',
    NEW_CHAT_ROOM: 'New chat room',
    NEW_EVENT_ROOM: 'New event room',
    NEW_POLL_ROOM: 'New poll room',
};
export const MEMBER_STATE_MAP = {
    0: 'guest',
    1: 'admin',
    3: 'pending member',
    4: 'member',
    9: 'skipped member',
};

export const MESSAGE_TIMESTAMP_LIMIT = 1615196052983;
export const ONE_DAY_SECONDS = '86400';
export const ALLOWED_COMMUNITY_ACTIONS = [3, 4, 5];
export const ALLOWED_CHATROOM_ACTIONS = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 17, 21, 27, 28];
export const ACTIONS_MAP = {
    VIEW_PARTICIPANTS: 2,
    MEMBER_DIRECTORY: 3,
    VIEW_PINNED_CHATROOMS: 4,
    VIEW_COMMUNTIY: 5,
    MUTE_NOTIFICATIONS: 6,
    UNFOLLOW_CHATROOM: 9,
    MARK_ACTIVE: 11,
    MARK_INACTIVE: 12,
    PIN_CHATROOM: 13,
    UNPIN_CHATROOM: 14,
    LEAVE_CHATROOM: 15,
    SETTINGS: 17,
    VIEW_PROFILE: 21,
    BLOCK: 27,
    UNBLOCK: 28,
};

export const LIKEMINDS_MEMBER_ID = 'member_id';
export const MEMBER_STATES = ['active', 'expired', 'grace-period', 'renewal-due'];

export const FREE_DAYS_ADDED = 'Extra Days Given Successfully.';
export const MEMBER_REMOVE_SUCCESS = 'Member Removed Successfully.';
export const REFUND_ERROR = 'There was an error during initiating the fund process.';
export const REFUND_SUCCESS = 'Refund Initiated Successfully.';

export const OFFLINE_LOCATION_ERROR = 'Please enter a valid location';
export const MEETING_LINK_ERROR = 'Meeting Link is required for Zoom Event.';
export const EVENT_COST_ERROR = 'Event Cost is required if event is paid.';
export const FILL_REQUIRED_ERROR = 'Please fill all the fields.';
export const EVENT_DATE_ERROR = "Event's Start Time must be less then Event's End Time.";
export const EVENT_DISCOUNT_ERROR = 'Discount must be less than 100%';
export const EVENT_DISCOUNT_FLAT_ERROR = "Discount must be less than event's cost";
export const EVENT_TYPE_ERROR = 'Atleast one is required.';
export const DOLLAR_SIGN = '$';
export const RUPEES_SIGN = 'Rs.';

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

// _____Event Attachment Constants_____
export const EDIT_EVENT_ATTACHMENT_SCREEN = 'Add Recording/Attachments';
export const SAVED_EVENT_ATTACHMENT_SCREEN = 'Event Recording/Attachments';

//Mobile number copy
export const MOBILE_NUMBER_COPIED = 'Mobile number added to clipboard';

export const APPROVAL_PENDING_TEXT = 'Approval pending for this community';

// ____Cookie Constants_____
export const COMMMUNITY_OPENED = '__community-opened__';

// Devices
export const DEVICE = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    TAB: 'tab',
};

// Create Event constants
export const EVENT_PLACES = { ZOOM_MEET: 'Zoom', GOOGLE_MEET: 'Google Meet', OFFLINE_MEET: 'Offline', OTHER_MEET: 'Other' };
export const EVENT_TYPES = { FREE_EVENT: 'Free Event', PAID_EVENT: 'Paid Event' };
export const EVENT_CONTENT_TYPES = { ADD_URL: 'Add URL', UPLOAD_FILE: 'Upload a file' };
