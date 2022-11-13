import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { MIXPANEL } from '../../enums/mixpanel.enum';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';

@Component({
    selector: 'app-emoji-list-mobile-sheet',
    templateUrl: './emoji-list-mobile-sheet.component.html',
    styleUrls: ['./emoji-list-mobile-sheet.component.scss'],
})
export class EmojiListMobileSheetComponent implements OnInit {
    messageReactions: any[];
    sortedMessageReactions: any[] = [];
    sortedReactionsList: any[] = [];
    user: any;
    selectedEmoji: any = 'All';
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private localStorageService: LocalStorageService,
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private snackBar: MatSnackBar,
        private analyticsService: AnalyticsService,
        private _bottomSheetRef: MatBottomSheetRef
    ) {}

    ngOnInit(): void {
        this.messageReactions = this.data?.reactionsList;
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.sortedMessageReactions = this.messageReactions;
        this.selectedEmoji = this.data?.reaction;
        this.sortMessageReactions();
        this.sortReactions();
    }

    sortReactions() {
        this.sortedReactionsList = this.messageReactions.reduce((result: any[], reaction) => {
            const reactionIndex = result.findIndex((el) => el?.emoji === reaction?.reaction);

            if (reactionIndex >= 0) result[reactionIndex].value++;
            else result.push({ emoji: reaction?.reaction, value: 1 });

            return result;
        }, []);
    }

    sortMessageReactions(event?) {
        if (event) this.selectedEmoji = event?.target?.innerText?.split(' ')[0];

        if (!this.selectedEmoji) {
            this.sortedMessageReactions = this.messageReactions;
            return;
        }

        if (this.selectedEmoji === 'All') this.sortedMessageReactions = this.messageReactions;
        else this.sortedMessageReactions = this.messageReactions.filter((reaction) => reaction?.reaction === this.selectedEmoji);
    }

    removeEmoji(event) {
        // this.chatroomService
        //     .removeConversationReaction({ chatroom_id: this.data?.chatroom_id, conversation_id: this.data?.conversation_id })
        //     .subscribe(
        //         (res) => {
        //             if (this.data?.conversation_id) this.homeFeedService.getConversations(this.data?.chatroom_id, {}, true);
        //             else this.homeFeedService.getChatroomDetail(this.data?.chatroom_id, {});

        //             const mixPanelPayload = {
        //                 message_id: this.data?.conversation_id,
        //                 chatroom_id: this.data?.chatroom_id,
        //                 community_id: this.data?.community_id,
        //             };
        //             this.analyticsService.sendEvent(MIXPANEL.REACTION_REMOVED, mixPanelPayload);
        //             this.snackBar.open('Reaction removed.', null, {
        //                 duration: 3000,
        //                 panelClass: ['black-bottom-event-attachment-snackbar'],
        //             });
        //         },
        //         (error) => {
        //             this.snackBar.open('Something went wrong', null, {
        //                 duration: 3000,
        //                 panelClass: ['black-bottom-event-attachment-snackbar'],
        //             });
        //         }
        //     );
        this._bottomSheetRef.dismiss(true);
        event.preventDefault();
    }
}
