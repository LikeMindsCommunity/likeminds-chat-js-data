import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SegmentModule } from 'ngx-segment-analytics';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../environments/environment';
import { createCustomElement } from '@angular/elements';
import { AsyncPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ImageCropperModule } from 'ngx-image-cropper';
import { APP_BASE_HREF } from '@angular/common';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { effects } from './shared/store/effects';
import { reducers } from './shared/store/reducers';
import { SocialModule } from './shared/social.module';
import { MaterialModule } from './shared/material.module';
import { BsModule } from './shared/bs.module';
import { MessagingService } from './core/services/messaging.service';
import { EncodeHttpParamsInterceptor } from './core/interceptors/encoded-interceptor';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeFeedComponent } from './pages/home-feed/page/home-feed/home-feed.component';
import { HomeFeedPanelComponent } from './pages/home-feed/components/home-feed-panel/home-feed-panel.component';
import { FeedChatroomCardComponent } from './pages/home-feed/components/feed-chatroom-card/feed-chatroom-card.component';
import { UpgradeMembershipBottomSheetComponent } from './pages/home-feed/entryComponents/upgrade-membership-bottom-sheet/upgrade-membership-bottom-sheet.component';
import { LeftPanelComponent } from './pages/dashboard/components/left-panel/left-panel.component';
import { ChatroomComponent } from './pages/collabcard/page/chatroom/chatroom.component';
import { ChatroomPanelComponent } from './pages/collabcard/components/chatroom-panel/chatroom-panel.component';
import { RejectDmDialogComponent } from './pages/collabcard/components/reject-dm-dialog/reject-dm-dialog.component';
import { ChatroomHeaderComponent } from './pages/collabcard/components/chatroom-header/chatroom-header.component';
import { ConversationsComponent } from './pages/collabcard/components/conversations/conversations.component';
import { ChatroomInputComponent } from './pages/collabcard/components/chatroom-input/chatroom-input.component';
import { NormalChatroomComponent } from './pages/collabcard/components/normal-chat-card/normal-chat-card.component';
import { ChatroomImageUploadComponent } from './pages/collabcard/components/chatroom-image-upload/chatroom-image-upload.component';
import { PreviewCardComponent } from './pages/collabcard/components/preview-card/preview-card.component';
import { PollCardComponent } from './pages/collabcard/components/poll-card/poll-card.component';
import { PollOptionButtonComponent } from './pages/collabcard/components/poll-option-button/poll-option-button.component';
import { AddPollOptionComponent } from './pages/collabcard/components/add-poll-option/add-poll-option.component';
import { VotersListComponent } from './pages/collabcard/components/voters-list/voters-list.component';
import { VoteSubmittedComponent } from './pages/collabcard/components/vote-submitted/vote-submitted.component';
import { AddPollOptionPopupComponent } from './pages/collabcard/entryComponents/add-poll-option-popup/add-poll-option-popup.component';
import { AddPollOptionSheetComponent } from './pages/collabcard/entryComponents/add-poll-option-sheet/add-poll-option-sheet.component';
import { AnonymousPollSheetComponent } from './pages/collabcard/entryComponents/anonymous-poll-sheet/anonymous-poll-sheet.component';
import { VoteSubmittedPopupComponent } from './pages/collabcard/entryComponents/vote-submitted-popup/vote-submitted-popup.component';
import { VoteSubmittedSheetComponent } from './pages/collabcard/entryComponents/vote-submitted-sheet/vote-submitted-sheet.component';
import { AttendEventComponent } from './pages/collabcard/components/attend-event/attend-event.component';
import { EventDetailComponent } from './pages/collabcard/components/event-detail/event-detail.component';
import { HostsSectionComponent } from './pages/collabcard/components/host-section/host-section.component';
import { MembersAttendingComponent } from './pages/collabcard/components/members-attending/members-attending.component';
import { AttendEventPopupComponent } from './pages/collabcard/entryComponents/attend-event-popup/attend-event-popup.component';
import { AttendEventSheetComponent } from './pages/collabcard/entryComponents/attend-event-sheet/attend-event-sheet.component';
import { EventJoinCommunityPopupComponent } from './pages/collabcard/entryComponents/event-join-community-popup/event-join-community-popup.component';
import { EventJoinCommunitySheetComponent } from './pages/collabcard/entryComponents/event-join-community-sheet/event-join-community-sheet.component';

import { UpdateProfileSheetComponent } from './pages/collabcard/entryComponents/update-profile-sheet/update-profile-sheet.component';
import { UpdateProfilePopupComponent } from './pages/collabcard/entryComponents/update-profile-popup/update-profile-popup.component';
import { JoinCommunitySheetComponent } from './pages/collabcard/components/join-community-sheet/join-community-sheet.component';
import { ReplyPreviewComponent } from './pages/collabcard/components/reply-preview/reply-preview.component';
import { ChatroomOverlayComponent } from './pages/collabcard/components/chatroom-overlay/chatroom-overlay.component';
import { AllAudiosContainerComponent } from './pages/collabcard/components/all-audios-container/all-audios-container.component';
import { AudioMessageComponent } from './pages/collabcard/components/audio-message/audio-message.component';
import { ChatroomPollCardComponent } from './pages/collabcard/components/chatroom-poll-card/chatroom-poll-card.component';
import { MediaGalleryPopupV2Component } from './pages/collabcard/entryComponents/media-gallery-popup-v2/media-gallery-popup-v2.component';
import { VoiceMessageComponent } from './pages/collabcard/components/voice-message/voice-message.component';
import { ThreadConversationsComponent } from './pages/collabcard/components/thread-conversations/thread-conversations.component';
import { EventAttachmentsDrawerComponent } from './pages/collabcard/components/event-attachments-drawer/event-attachments-drawer.component';
import { EventAttachmentsMobileComponent } from './pages/collabcard/components/event-attachments-mobile/event-attachments-mobile.component';
import { LinkPreviewComponent } from './pages/collabcard/components/link-preview/link-preview.component';
import { VotersListDialogComponent } from './pages/collabcard/entryComponents/voters-list-dialog/voters-list-dialog.component';
import { ConfirmDmRequestDialogComponent } from './pages/collabcard/components/confirm-dm-request-dialog/confirm-dm-request-dialog.component';
import { ApproveDmRequestDialogComponent } from './pages/collabcard/components/approve-dm-request-dialog/approve-dm-request-dialog.component';
import { ConfirmBlockDialogComponent } from './pages/collabcard/components/confirm-block-dialog/confirm-block-dialog.component';
import { AudioPermissionPopupComponent } from './pages/collabcard/entryComponents/audio-permission-popup/audio-permission-popup.component';
import { CommunityFeedComponent } from './pages/community-feed/page/community-feed/community-feed.component';
import { CommunityFeedPanelComponent } from './pages/community-feed/components/community-feed-panel/community-feed-panel.component';
import { CommunityFeedHeaderComponent } from './pages/community-feed/components/community-feed-header/community-feed-header.component';
import { CommunityFeedChatroomCardComponent } from './pages/community-feed/components/community-feed-chatroom-card/community-feed-chatroom-card.component';
import { CommunityDetailComponent } from './pages/community-feed/components/community-detail/community-detail.component';
import { PinnedListComponent } from './pages/community-feed/components/pinned-list/pinned-list.component';
import { PinnedFeedComponent } from './pages/community-feed/page/pinned-feed/pinned-feed.component';
import { ProfileComponent } from './pages/profile/pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/pages/edit-profile/edit-profile.component';
import { ReportMemberPopupComponent } from './pages/profile/entryComponents/report-member-popup/report-member-popup.component';
import { MemberReportedPopupComponent } from './pages/profile/entryComponents/member-reported-popup/member-reported-popup.component';
import { ImageChooserComponent } from './pages/profile/entryComponents/image-chooser/image-chooser.component';
import { ProfileNotAccessiblePopupComponent } from './pages/profile/entryComponents/profile-not-accessible-popup/profile-not-accessible-popup.component';
import { ChatroomOptionsSheetComponent } from './pages/profile/entryComponents/chatroom-options-sheet/chatroom-options-sheet.component';
import { ReportPageComponent } from './pages/profile/pages/components/report-page/report-page.component';
import { MobileImageCropperComponent } from './pages/profile/components/mobile-image-cropper/mobile-image-cropper.component';
import { RemoveProfileComponent } from './pages/profile/entryComponents/remove-profile/remove-profile.component';
import { ImageCropperComponent } from './pages/profile/entryComponents/image-cropper/image-cropper.component';
import { ReportPopupComponent } from './shared/entryComponents/report-popup/report-popup.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ReportedPopupComponent } from './shared/entryComponents/reported-popup/reported-popup.component';
import { ViewParticipantsComponent } from './pages/view-participants/page/view-participants/view-participants.component';
import { ParticipantsComponent } from './pages/view-participants/components/participants/participants.component';
import { RemoveParticipantsDialogComponent } from './pages/view-participants/entryComponents/remove-participants-dialog/remove-participants-dialog.component';

declare global {
    interface Window {
        analytics: any;
    }
}

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LeftPanelComponent,
        HomeFeedComponent,
        HomeFeedPanelComponent,
        FeedChatroomCardComponent,
        UpgradeMembershipBottomSheetComponent,
        ChatroomComponent,
        ChatroomPanelComponent,
        RejectDmDialogComponent,
        ChatroomHeaderComponent,
        ConversationsComponent,
        ChatroomInputComponent,
        NormalChatroomComponent,
        ChatroomImageUploadComponent,
        PreviewCardComponent,
        PollCardComponent,
        PollOptionButtonComponent,
        AddPollOptionComponent,
        VotersListComponent,
        VoteSubmittedComponent,
        AddPollOptionPopupComponent,
        AddPollOptionSheetComponent,
        AnonymousPollSheetComponent,
        VoteSubmittedPopupComponent,
        VoteSubmittedSheetComponent,
        AttendEventComponent,
        EventDetailComponent,
        HostsSectionComponent,
        MembersAttendingComponent,
        AttendEventPopupComponent,
        AttendEventSheetComponent,
        EventJoinCommunityPopupComponent,
        EventJoinCommunitySheetComponent,
        UpdateProfilePopupComponent,
        UpdateProfileSheetComponent,
        JoinCommunitySheetComponent,
        ReplyPreviewComponent,
        ChatroomOverlayComponent,
        MediaGalleryPopupV2Component,
        ChatroomPollCardComponent,
        AudioMessageComponent,
        AllAudiosContainerComponent,
        VoiceMessageComponent,
        ThreadConversationsComponent,
        EventAttachmentsDrawerComponent,
        EventAttachmentsMobileComponent,
        LinkPreviewComponent,
        VotersListDialogComponent,
        ConfirmDmRequestDialogComponent,
        ApproveDmRequestDialogComponent,
        ConfirmBlockDialogComponent,
        AudioPermissionPopupComponent,
        CommunityFeedComponent,
        CommunityFeedPanelComponent,
        CommunityFeedHeaderComponent,
        CommunityFeedChatroomCardComponent,
        CommunityDetailComponent,
        PinnedListComponent,
        PinnedFeedComponent,
        ProfileComponent,
        EditProfileComponent,
        ReportMemberPopupComponent,
        MemberReportedPopupComponent,
        ImageCropperComponent,
        ImageChooserComponent,
        ProfileNotAccessiblePopupComponent,
        ChatroomOptionsSheetComponent,
        ReportPageComponent,
        MobileImageCropperComponent,
        RemoveProfileComponent,
        ReportPopupComponent,
        AuthComponent,
        ReportedPopupComponent,
        ViewParticipantsComponent,
        ParticipantsComponent,
        RemoveParticipantsDialogComponent,
    ],
    imports: [
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireStorageModule,
        AngularFireModule.initializeApp(environment.firebaseConfig, 'cloud'),
        HttpClientModule,
        StoreModule.forRoot(reducers),
        TranslateModule.forRoot({
            // loader: {
            //     provide: TranslateLoader,
            //     useFactory: httpTranslateLoader,
            //     deps: [HttpClient],
            // },
        }),
        ServiceWorkerModule.register('ngsw-worker.js, firebase-messaging-sw.js', {
            enabled: environment.production,
        }),
        SegmentModule.forRoot({ apiKey: environment.segMentKey, debug: true, loadOnInitialization: true }),
        EffectsModule.forRoot(effects),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: false,
            features: {
                pause: false,
                lock: true,
                persist: true,
            },
        }),
        SharedModule,
        SocialModule,
        BrowserAnimationsModule,
        MaterialModule,
        BsModule,
        InfiniteScrollModule,
        NgbModule,
        ImageCropperModule,
        EmojiModule,
        PickerModule,
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/community' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: EncodeHttpParamsInterceptor,
            multi: true,
        },
        MessagingService,
        AsyncPipe,
        CookieService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
    ],
    // bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [AppComponent],
})
export class AppModule {
    constructor(private injector: Injector) {}
    ngDoBootstrap() {
        const el = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define('likeminds-sdk', el);
    }
}
