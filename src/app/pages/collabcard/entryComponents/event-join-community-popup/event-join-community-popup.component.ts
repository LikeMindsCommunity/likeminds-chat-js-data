import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IUser } from 'src/app/shared/models/user.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { IChatroom } from 'src/app/shared/models/chatroom.model';

@Component({
    selector: 'event-join-community-popup',
    templateUrl: './event-join-community-popup.component.html'
})

export class EventJoinCommunityPopupComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { chatroom: IChatroom, community: ICommunity, admins?: IUser[], message: string },
        private dialogRef: MatDialogRef<any>) { }

    close(event) {
        this.dialogRef.close(event);
    }
}