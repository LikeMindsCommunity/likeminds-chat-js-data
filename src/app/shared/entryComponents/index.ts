import { LeavePageComponent } from './leave-page/leave-page.component';
import { CountryDropdownComponent } from '../components/country-dropdown/country-dropdown.component';
import { MergeAccountConfirmationComponent } from '../components/login/entryComponents/merge-account-confirmation/merge-account-confirmation.component';
import { VerifyMergeAccountComponent } from '../components/login/entryComponents/verify-merge-account/verify-merge-account.component';
import { LeavePollComponent } from './leave-poll/leave-poll.component';
import { ChoiceDialogComponent } from './choice-dialog/choice-dialog.component';
import { ChoiceSheetComponent } from './choice-sheet/choice-sheet.component';
import { UpdateProfilePopupComponent } from './update-profile-popup/update-profile-popup.component';
import { UpdateProfileSheetComponent } from './update-profile-sheet/update-profile-sheet.component';
import { ProfileNotExistPopupComponent } from './profile-not-exist-popup/profile-not-exist-popup.component';
import { JoinCommunityPopupComponent } from './join-community-popup/join-community-popup.component';
import { JoinCommunitySheetComponent } from './join-community-sheet/join-community-sheet.component';
import { HintModalComponent } from './hint-modal/hint-modal.component';
import { HintSheetComponent } from './hint-sheet/hint-sheet.component';
import { ReportedPopupComponent } from './reported-popup/reported-popup.component';
import { EventPrivacyPopupComponent } from '../components/create-chatroom/eventroomform/event-privacy-popup/event-privacy-popup.component';
import { EventPrivacySheetComponent } from '../components/create-chatroom/eventroomform/event-privacy-sheet/event-privacy-sheet.component';
import { BannerGuidelinePopupComponent } from '../components/create-chatroom/eventroomform/banner-guideline-popup/banner-guideline-popup.component';
import { BannerGuidelineSheetComponent } from '../components/create-chatroom/eventroomform/banner-guideline-sheet/banner-guideline-sheet.component';
import { OnlineUrlGuidelineSheetComponent } from '../components/create-chatroom/eventroomform/online-url-guideline-sheet/online-url-guideline-sheet.component';
import { OnlineUrlGuidelinePopupComponent } from '../components/create-chatroom/eventroomform/online-url-guideline-popup/online-url-guideline-popup.component';
import { PollChatroomRenamePopupComponent } from './poll-chatroom-rename-popup/poll-chatroom-rename-popup.component';
import { PollChatroomRenameSheetComponent } from './poll-chatroom-rename-sheet/poll-chatroom-rename-sheet.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { PinChatroomPopupComponent } from './pin-chatroom-popup/pin-chatroom-popup.component';
import { PaymentModalDialogComponent } from './payment-modal-dialog/payment-modal-dialog.component';

import { AllowNotificationDialogComponent } from './allow-notification-dialog/allow-notification-dialog.component';
import { AllowNotificationSheetComponent } from './allow-notification-sheet/allow-notification-sheet.component';
import { AllowGuideDialogComponent } from './allow-guide-dialog/allow-guide-dialog.component';
import { LeaveCommunityComponent } from './leave-community/leave-community.component';
import { ReferralComponent } from './referral/referral.component';
import { ReferralMobileComponent } from './referral-mobile/referral-mobile.component';
import { ShareUrlComponent } from './share-url/share-url.component';
import { ShareUrlMobileComponent } from './share-url-mobile/share-url-mobile.component';
import { PollsChatCardComponent } from './polls-chat-card/polls-chat-card.component';
import { EventRemoveAttachmentDialogComponent } from './event-remove-attachment-dialog/event-remove-attachment-dialog.component';
import { EmojiListDialogComponent } from './emoji-list-dialog/emoji-list-dialog.component';
import { EmojiListMobileSheetComponent } from './emoji-list-mobile-sheet/emoji-list-mobile-sheet.component';
import { DenyAccessComponent } from '../components/deny-access/deny-access.component';
import { EventCommunityPaymentComponent } from './event-community-payment/event-community-payment.component';
import { SecretChatroomDialogComponent } from './secret-chatroom-dialog/secret-chatroom-dialog.component';
import { SecretChatroomSheetComponent } from './secret-chatroom-sheet/secret-chatroom-sheet.component';
import { BuyCommunityMembershipSheetComponent } from './buy-community-membership-sheet/buy-community-membership-sheet.component';
import { EventCommunityPaymentSheetComponent } from './event-community-payment-sheet/event-community-payment-sheet.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { UpgradeYourPlanDialogComponent } from './upgrade-you-plan-dialog/upgrade-your-plan-dialog/upgrade-your-plan-dialog.component';
import { AddMembershipPlanDialogComponent } from './add-membership-plan-dialog/add-membership-plan-dialog.component';
import { InviteMembersViaEmailMobileComponent } from './invite-members-via-email-mobile/invite-members-via-email-mobile.component';
import { InviteMembersViaWhatsappMobileComponent } from './invite-members-via-whatsapp-mobile/invite-members-via-whatsapp-mobile.component';
import { AvailableOnlyOnAppComponent } from './available-only-on-app/available-only-on-app.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';

export const entryComponents = [
    InviteMembersViaWhatsappMobileComponent,
    InviteMembersViaEmailMobileComponent,
    AddMembershipPlanDialogComponent,
    UpgradeYourPlanDialogComponent,
    LeavePollComponent,
    LeavePageComponent,
    CountryDropdownComponent,
    MergeAccountConfirmationComponent,
    VerifyMergeAccountComponent,
    ChoiceDialogComponent,
    ChoiceSheetComponent,
    UpdateProfilePopupComponent,
    UpdateProfileSheetComponent,
    ProfileNotExistPopupComponent,
    JoinCommunityPopupComponent,
    JoinCommunitySheetComponent,
    HintModalComponent,
    HintSheetComponent,
    // ReportedPopupComponent,
    EventPrivacyPopupComponent,
    EventPrivacySheetComponent,
    BannerGuidelinePopupComponent,
    BannerGuidelineSheetComponent,
    OnlineUrlGuidelineSheetComponent,
    OnlineUrlGuidelinePopupComponent,
    PollChatroomRenamePopupComponent,
    PollChatroomRenameSheetComponent,
    DeleteConfirmationComponent,
    PinChatroomPopupComponent,
    PaymentModalDialogComponent,
    PinChatroomPopupComponent,
    AllowNotificationDialogComponent,
    AllowNotificationSheetComponent,
    AllowGuideDialogComponent,
    LeaveCommunityComponent,
    ReferralComponent,
    ReferralMobileComponent,
    ShareUrlComponent,
    ShareUrlMobileComponent,
    PollsChatCardComponent,
    EventRemoveAttachmentDialogComponent,
    EmojiListDialogComponent,
    EmojiListMobileSheetComponent,
    DenyAccessComponent,
    EventCommunityPaymentComponent,
    SecretChatroomDialogComponent,
    SecretChatroomSheetComponent,
    BuyCommunityMembershipSheetComponent,
    EventCommunityPaymentSheetComponent,
    ImageCropperComponent,
    AvailableOnlyOnAppComponent,
    CustomSnackbarComponent,
];
