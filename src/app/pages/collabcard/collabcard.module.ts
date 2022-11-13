import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatroomPanelComponent } from './components/chatroom-panel/chatroom-panel.component';
import { ChatroomHeaderComponent } from './components/chatroom-header/chatroom-header.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
// import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { ChatroomInputComponent } from './components/chatroom-input/chatroom-input.component';
import { NormalChatroomComponent } from './components/normal-chat-card/normal-chat-card.component';
import { ChatroomImageUploadComponent } from './components/chatroom-image-upload/chatroom-image-upload.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PreviewCardComponent } from './components/preview-card/preview-card.component';
import { PollCardComponent } from './components/poll-card/poll-card.component';
import { PollOptionButtonComponent } from './components/poll-option-button/poll-option-button.component';
import { AddPollOptionComponent } from './components/add-poll-option/add-poll-option.component';
import { VotersListComponent } from './components/voters-list/voters-list.component';
import { VoteSubmittedComponent } from './components/vote-submitted/vote-submitted.component';
import { AddPollOptionPopupComponent } from './entryComponents/add-poll-option-popup/add-poll-option-popup.component';
import { AddPollOptionSheetComponent } from './entryComponents/add-poll-option-sheet/add-poll-option-sheet.component';
import { AnonymousPollSheetComponent } from './entryComponents/anonymous-poll-sheet/anonymous-poll-sheet.component';
import { VoteSubmittedPopupComponent } from './entryComponents/vote-submitted-popup/vote-submitted-popup.component';
import { VoteSubmittedSheetComponent } from './entryComponents/vote-submitted-sheet/vote-submitted-sheet.component';
import { AttendEventComponent } from './components/attend-event/attend-event.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { HostsSectionComponent } from './components/host-section/host-section.component';
import { MembersAttendingComponent } from './components/members-attending/members-attending.component';
import { AttendEventPopupComponent } from './entryComponents/attend-event-popup/attend-event-popup.component';
import { AttendEventSheetComponent } from './entryComponents/attend-event-sheet/attend-event-sheet.component';
import { EventJoinCommunityPopupComponent } from './entryComponents/event-join-community-popup/event-join-community-popup.component';
import { EventJoinCommunitySheetComponent } from './entryComponents/event-join-community-sheet/event-join-community-sheet.component';
import { UpdateProfilePopupComponent } from './entryComponents/update-profile-popup/update-profile-popup.component';
import { UpdateProfileSheetComponent } from './entryComponents/update-profile-sheet/update-profile-sheet.component';
import { JoinCommunitySheetComponent } from './components/join-community-sheet/join-community-sheet.component';
import { ReplyPreviewComponent } from './components/reply-preview/reply-preview.component';

import { ChatroomOverlayComponent } from './components/chatroom-overlay/chatroom-overlay.component';
import { MediaGalleryPopupV2Component } from './entryComponents/media-gallery-popup-v2/media-gallery-popup-v2.component';
import { ChatroomPollCardComponent } from './components/chatroom-poll-card/chatroom-poll-card.component';
import { AudioMessageComponent } from './components/audio-message/audio-message.component';
import { AllAudiosContainerComponent } from './components/all-audios-container/all-audios-container.component';
import { VoiceMessageComponent } from './components/voice-message/voice-message.component';
import { ThreadConversationsComponent } from './components/thread-conversations/thread-conversations.component';
import { EventAttachmentsDrawerComponent } from './components/event-attachments-drawer/event-attachments-drawer.component';
import { EventAttachmentsMobileComponent } from './components/event-attachments-mobile/event-attachments-mobile.component';
import { LinkPreviewComponent } from './components/link-preview/link-preview.component';
import { EVENT_DETAIL, ROOT_PATH } from 'src/app/shared/constants/routes.constant';
import { ChatroomComponent } from './page/chatroom/chatroom.component';
import { VotersListDialogComponent } from './entryComponents/voters-list-dialog/voters-list-dialog.component';
import { RejectDmDialogComponent } from './components/reject-dm-dialog/reject-dm-dialog.component';
import { ConfirmDmRequestDialogComponent } from './components/confirm-dm-request-dialog/confirm-dm-request-dialog.component';
// import { ApproveDmRequestDialogComponent } from './components/approve-dm-request-dialog/approve-dm-request-dialog.component';
// import { ConfirmBlockDialogComponent } from './components/confirm-block-dialog/confirm-block-dialog.component';
// import { AudioPermissionPopupComponent } from './entryComponents/audio-permission-popup/audio-permission-popup.component';

const collabcardRoutes: Routes = [
    // {
    //     path: ':chatroomId',
    //     component: ChatroomComponent,
    //     children: [
    //         {
    //             path: ROOT_PATH,
    //             component: ChatroomPanelComponent,
    //         },
    //     ],
    // },
];

@NgModule({
    declarations: [
        // ChatroomPanelComponent,
        // ChatroomComponent,
        // ChatroomHeaderComponent,
        // ConversationsComponent,
        // ChatroomInputComponent,
        // NormalChatroomComponent,
        // ChatroomImageUploadComponent,
        // PreviewCardComponent,
        // PollCardComponent,
        // PollOptionButtonComponent,
        // AddPollOptionComponent,
        // VotersListComponent,
        // VoteSubmittedComponent,
        // AddPollOptionPopupComponent,
        // AddPollOptionSheetComponent,
        // AnonymousPollSheetComponent,
        // VoteSubmittedPopupComponent,
        // VoteSubmittedSheetComponent,
        // AttendEventComponent,
        // EventDetailComponent,
        // HostsSectionComponent,
        // MembersAttendingComponent,
        // AttendEventPopupComponent,
        // AttendEventSheetComponent,
        // EventJoinCommunityPopupComponent,
        // EventJoinCommunitySheetComponent,
        // UpdateProfilePopupComponent,
        // UpdateProfileSheetComponent,
        // JoinCommunitySheetComponent,
        // ReplyPreviewComponent,
        // ChatroomOverlayComponent,
        // MediaGalleryPopupV2Component,
        // ChatroomPollCardComponent,
        // AudioMessageComponent,
        // AllAudiosContainerComponent,
        // VoiceMessageComponent,
        // ThreadConversationsComponent,
        // EventAttachmentsDrawerComponent,
        // EventAttachmentsMobileComponent,
        // LinkPreviewComponent,
        // VotersListDialogComponent,
        // RejectDmDialogComponent,
        // ConfirmDmRequestDialogComponent,
        // ApproveDmRequestDialogComponent,
        // ConfirmBlockDialogComponent,
        // AudioPermissionPopupComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(collabcardRoutes),
        SharedModule,
        MaterialModule,
        NgxBootstrapSliderModule,
        InfiniteScrollModule,
        FormsModule,
        PickerModule,
        // EmojiModule,
    ],
    exports: [RouterModule],
})
export class CollabcardModule {}
