import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DOWNLOAD_APP_TEXT2 } from 'src/app/shared/constants/app-constant';

@Component({
    selector: 'app-vote-submitted',
    templateUrl: './vote-submitted.component.html',
    styleUrls: ['./vote-submitted.component.scss'],
})
export class VoteSubmittedComponent implements OnInit {
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Input() isSheet: boolean;
    @Input() endDate: string;

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}

    downloadApp() {
        const data = {
            heading: 'Download App',
            subHeading1: DOWNLOAD_APP_TEXT2,
        };
        this.close.emit();
        // const dialog = this.dialog.open(DownloadAppComponent, {
        //     panelClass: 'download-app-modal',
        //     data
        // });
        // dialog.afterClosed().subscribe(response => {

        // });
    }
}
