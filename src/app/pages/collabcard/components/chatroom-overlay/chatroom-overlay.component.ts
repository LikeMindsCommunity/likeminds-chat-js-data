import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { IChatroom } from '../../../../shared/models/chatroom.model';
import { IUser } from '../../../../shared/models/user.model';
import { IMemberState } from '../../../../shared/models/member.model';
import { ResizeService } from '../../../../core/services/resize.service';
import { ICommunity } from '../../../../shared/models/community.model';
import {
    CHATROOM_DELETED_MESSAGE,
    CHATROOM_EXPIRED_MESSAGE,
    CHATROOM_NON_MEMBER_MESSAGE,
    CHATROOM_NOT_LOGGEDIN_MESSAGE,
} from '../../../../shared/constants/app-constant';
// import { ChatroomDeletedSheetComponent } from '../../../../pages/chatroom/entryComponents/chatroom-deleted-sheet/chatroom-deleted-sheet.component';
// import { ChatroomExpiredSheetComponent } from '../../../../pages/chatroom/entryComponents/chatroom-expired-sheet/chatroom-expired-sheet.component';
// import { CommunityDetailSheetComponent } from '../../../../pages/chatroom/entryComponents/community-detail-sheet/community-detail-sheet.component';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';

@Component({
    selector: 'chatroom-overlay',
    templateUrl: './chatroom-overlay.component.html',
    styleUrls: ['./chatroom-overlay.component.scss'],
})
export class ChatroomOverlayComponent implements OnInit, OnChanges {
    @Output() closeOverlay: EventEmitter<any> = new EventEmitter();

    @Input() chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() admins: IUser[];
    @Input() ajExpired: boolean;
    @Input() user: IUser;
    @Input() memberState: IMemberState;
    @Input() isOverlayActive: boolean;
    @Input() showNewChatroomCommunityDetail: boolean;

    screenType: string;
    nonMember: any;
    isSheetOpen: boolean;
    accessibleWithoutSubscription: boolean;
    showOverlay: boolean = true;

    constructor(
        private bottomSheet: MatBottomSheet,
        private resizeService: ResizeService,
        private localStorageService: LocalStorageService,
        private chatroomService: ChatroomService
    ) {}

    ngOnInit() {
        this.openSheetOnMobile();
        this.resizeService.onResize$.subscribe((size) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
            this.openSheetOnMobile();
        });
        this.nonMember = this.localStorageService.getSavedState('nonMemberEvent');
        this.chatroomService.showNewChatroomCommunityDetail$$.subscribe((res) => {
            this.showNewChatroomCommunityDetail = res;
        });
        this.chatroomService.accessibleWithoutSubscription$$.subscribe((res) => {
            this.accessibleWithoutSubscription = res;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes.chatroom && changes.chatroom.currentValue) ||
            (changes.memberState && changes.memberState.currentValue) ||
            (changes.admins && changes.admins.currentValue)
        ) {
            this.openSheetOnMobile();
        }
        this.nonMember = this.localStorageService.getSavedState('nonMemberEvent');
    }

    hideOverlay() {
        this.showOverlay = false;
    }

    openSheetOnMobile() {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        if (this.screenType === 'mobile') {
            if (this.chatroom && this.chatroom?.deleted_by && this.ajExpired) this.openChatroomExpiredSheet();
            else if (this.chatroom && this.chatroom?.deleted_by && (!this.user || !this.memberState?.state))
                this.openChatroomDeletedSheet();
            else if (this.chatroom && this.chatroom?.type === 3 && !this.user && !this.memberState?.state)
                this.openChatroomNotLoggedInSheet();
            else if (this.chatroom && this.chatroom?.type === 3 && this.user && this.memberState?.state === 0)
                this.openChatroomNonMemberSheet();
            else if (this.chatroom && this.chatroom?.type === 3 && this.user && [1, 4].includes(this.memberState?.state))
                this.bottomSheet.dismiss();
        } else {
            this.bottomSheet.dismiss();
        }
    }

    openChatroomDeletedSheet() {
        if (this.isSheetOpen || !this.admins || !this.chatroom || !this.community) return;
        this.isSheetOpen = true;
        // const sheetRef = this.bottomSheet.open(ChatroomDeletedSheetComponent, {
        //     data: {
        //         chatroom: this.chatroom,
        //         community: this.community,
        //         admins: this.admins,
        //         message: CHATROOM_DELETED_MESSAGE,
        //     },
        // });
        // sheetRef.afterDismissed().subscribe((response) => (this.isSheetOpen = false));
    }

    openChatroomExpiredSheet() {
        if (this.isSheetOpen || !this.admins || !this.chatroom || !this.community) return;
        this.isSheetOpen = true;
        // const sheetRef = this.bottomSheet.open(ChatroomExpiredSheetComponent, {
        //     data: {
        //         chatroom: this.chatroom,
        //         community: this.community,
        //         admins: this.admins,
        //         message: CHATROOM_EXPIRED_MESSAGE,
        //     },
        // });
        // sheetRef.afterDismissed().subscribe((response) => (this.isSheetOpen = false));
    }

    openChatroomNotLoggedInSheet() {
        if (this.isSheetOpen || !this.admins || !this.chatroom || !this.community) return;
        this.isSheetOpen = true;
        // const sheetRef = this.bottomSheet.open(CommunityDetailSheetComponent, {
        //     data: {
        //         memberState: this.memberState,
        //         user: this.user,
        //         community: this.community,
        //         admins: this.admins,
        //         message: CHATROOM_NOT_LOGGEDIN_MESSAGE,
        //     },
        //     disableClose: true,
        // });
        // sheetRef.afterDismissed().subscribe((response) => (this.isSheetOpen = false));
    }

    openChatroomNonMemberSheet() {
        if (this.isSheetOpen || !this.admins || !this.chatroom || !this.community) return;
        this.isSheetOpen = true;
        // const sheetRef = this.bottomSheet.open(CommunityDetailSheetComponent, {
        //     data: {
        //         memberState: this.memberState,
        //         user: this.user,
        //         community: this.community,
        //         admins: this.admins,
        //         message: CHATROOM_NON_MEMBER_MESSAGE,
        //     },
        //     disableClose: true,
        // });
        // sheetRef.afterDismissed().subscribe((response) => (this.isSheetOpen = false));
    }
}
