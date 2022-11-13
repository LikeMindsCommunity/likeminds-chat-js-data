import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DmService } from 'src/app/core/services/dm.services';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';

@Component({
    selector: 'app-reject-dm-dialog',
    templateUrl: './reject-dm-dialog.component.html',
    styleUrls: ['./reject-dm-dialog.component.scss'],
})
export class RejectDmDialogComponent implements OnInit {
    constructor(
        private dmService: DmService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<RejectDmDialogComponent>,
        private homeFeedService: HomeFeedService
    ) {}

    ngOnInit(): void {}

    rejectDMRequest(report?: boolean) {
        if (report) {
            this.dialogRef.close();
            // this.dialog.open(ReportMemberPopupComponent, {
            //   data: {
            //     community_id: this.data.chatroom.community_id,
            //     collabcard_id: this.data.chatroom.id
            //   },
            // }).afterClosed().subscribe(res => {
            //   if (res === 'reported') {
            //     this.dmService.requestDM({ chatroom_id: this.data.chatroom.id, chat_request_state: 2 }).toPromise().then(res => {
            //     })
            //   }
            // })
        } else {
            this.dmService
                .requestDM({ chatroom_id: this.data.chatroom.id, chat_request_state: 2 })
                .toPromise()
                .then((res) => {
                    // location.reload();
                    this.homeFeedService.refreshEvent.next(true);
                    this.dialogRef.close();
                });
        }
    }
}
