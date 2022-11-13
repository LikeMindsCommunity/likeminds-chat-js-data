import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { components } from './components';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxAutocomPlaceModule } from 'ngx-autocom-place';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { directives } from './directives';
import { pipes } from './pipes';
import { entryComponents } from './entryComponents';
import { MaterialModule } from './material.module';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MyHammerConfig } from '../core/services/hammer-config.service';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { MentionModule } from 'angular-mentions';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsModule } from './bs.module';
import { ChatroomformComponent } from './components//create-chatroom/chatroomform/chatroomform.component';
import { EventroomformComponent } from './components/create-chatroom/eventroomform/eventroomform.component';
import { PollroomformComponent } from './components/create-chatroom/pollroomform/pollroomform.component';
import { CommunityListComponent } from './components/create-chatroom/community-list/community-list.component';
import { ExternalLinkDirective } from './directives/external-link.directive';
import { ConnectionServiceModule } from 'ng-connection-service';
import { EmojiPipe } from './pipes/emoji.pipe';
import { PaymentModalDialogComponent } from './entryComponents/payment-modal-dialog/payment-modal-dialog.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { LeaveCommunityComponent } from './entryComponents/leave-community/leave-community.component';
import { CommunityExpiredOverlayComponent } from './components/community-expired-overlay/community-expired-overlay.component';
import { MySubscriptionsComponent } from './components/my-subscriptions/my-subscriptions.component';
import { SubscriptionHistoryComponent } from './components/subscription-history/subscription-history.component';
import { ReferralComponent } from './entryComponents/referral/referral.component';
import { ReferralMobileComponent } from './entryComponents/referral-mobile/referral-mobile.component';
import { ShareUrlComponent } from './entryComponents/share-url/share-url.component';
import { ShareUrlMobileComponent } from './entryComponents/share-url-mobile/share-url-mobile.component';
import { PollsChatCardComponent } from './entryComponents/polls-chat-card/polls-chat-card.component';
import { MediaUploadPreviewComponent } from './components/media-upload-preview/media-upload-preview.component';
import { EventRemoveAttachmentDialogComponent } from './entryComponents/event-remove-attachment-dialog/event-remove-attachment-dialog.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { EmojiListDialogComponent } from './entryComponents/emoji-list-dialog/emoji-list-dialog.component';
import { EmojiListMobileSheetComponent } from './entryComponents/emoji-list-mobile-sheet/emoji-list-mobile-sheet.component';
import { DenyAccessComponent } from './components/deny-access/deny-access.component';
import { EventCommunityPaymentComponent } from './entryComponents/event-community-payment/event-community-payment.component';
import { SecretChatroomDialogComponent } from './entryComponents/secret-chatroom-dialog/secret-chatroom-dialog.component';
import { SecretChatroomSheetComponent } from './entryComponents/secret-chatroom-sheet/secret-chatroom-sheet.component';
import { BuyCommunityMembershipSheetComponent } from './entryComponents/buy-community-membership-sheet/buy-community-membership-sheet.component';
import { EventCommunityPaymentSheetComponent } from './entryComponents/event-community-payment-sheet/event-community-payment-sheet.component';
import { ImageCropperComponent } from './entryComponents/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HomePageProfileDrawerComponent } from './components/home-page-profile-drawer/home-page-profile-drawer.component';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';
import { icons } from './icon-components';
import { CustomSnackbarComponent } from './entryComponents/custom-snackbar/custom-snackbar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule,
        NgOtpInputModule,
        FormsModule,
        CarouselModule,
        NgCircleProgressModule.forRoot({}),
        NgxAutocomPlaceModule,
        GooglePlaceModule,
        MaterialModule,
        NgxImageGalleryModule,
        MentionModule,
        BsModule,
        ConnectionServiceModule,
        InfiniteScrollModule,
        ImageCropperModule,
    ],
    declarations: [
        ...components,
        ...directives,
        ...pipes,
        ...entryComponents,
        ...icons,
        ChatroomformComponent,
        EventroomformComponent,
        PollroomformComponent,
        CommunityListComponent,
        ExternalLinkDirective,
        EmojiPipe,
        NotificationComponent,
        TutorialComponent,
        PaymentModalDialogComponent,
        NotificationComponent,
        LeaveCommunityComponent,
        CommunityExpiredOverlayComponent,
        MySubscriptionsComponent,
        SubscriptionHistoryComponent,
        ReferralComponent,
        ReferralMobileComponent,
        ShareUrlComponent,
        ShareUrlMobileComponent,
        PollsChatCardComponent,
        MediaUploadPreviewComponent,
        EventRemoveAttachmentDialogComponent,
        PaymentComponent,
        PaymentSuccessComponent,
        EmojiListDialogComponent,
        EmojiListMobileSheetComponent,
        DenyAccessComponent,
        EventCommunityPaymentComponent,
        SecretChatroomDialogComponent,
        SecretChatroomSheetComponent,
        BuyCommunityMembershipSheetComponent,
        EventCommunityPaymentSheetComponent,
        ImageCropperComponent,
        HomePageProfileDrawerComponent,
        SanitizeUrlPipe,
        CustomSnackbarComponent,
    ],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule,
        NgOtpInputModule,
        FormsModule,
        CarouselModule,
        NgCircleProgressModule,
        GooglePlaceModule,
        NgxAutocomPlaceModule,
        NgxImageGalleryModule,
        InfiniteScrollModule,
        MentionModule,
        ...components,
        ...directives,
        ...pipes,
        ...entryComponents,
        ...icons,
    ],
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
    ],
})
export class SharedModule {}
