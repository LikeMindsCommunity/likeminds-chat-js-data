import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IUser } from 'src/app/shared/models/user.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { IChatroom } from 'src/app/shared/models/chatroom.model';

@Component({
    selector: 'event-join-community-sheet',
    templateUrl: './event-join-community-sheet.component.html'
})

export class EventJoinCommunitySheetComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: { chatroom: IChatroom, community: ICommunity, admins?: IUser[], message: string },
        private bottomSheetRef: MatBottomSheetRef<any>) { }

    close(event) {
        this.bottomSheetRef.dismiss(event);
    }
}