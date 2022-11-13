import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeFeedService } from '../../../core/services/home-feed.service';
import { MessagingService } from '../../../core/services/messaging.service';
@Component({
    selector: 'app-allow-guide-dialog',
    templateUrl: './allow-guide-dialog.component.html',
    styleUrls: ['./allow-guide-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AllowGuideDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messagingService: MessagingService,
        private homeFeedService: HomeFeedService
    ) {}

    ngOnInit(): void {}

    sure(data) {
        this.messagingService.requestPermission().subscribe((resToken) => {
            const param = {
                // member_id: this.user?.id,
                // device_id: this.deviceStorage.deviceID,
                token: resToken,
            };
            this.homeFeedService.pushNotification(param).subscribe((_) => {});
        });
        this.dialogRef.close(data);
    }
}
