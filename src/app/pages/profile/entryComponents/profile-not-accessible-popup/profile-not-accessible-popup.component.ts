import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { COMMUNITY_DETAIL_PATH } from 'src/app/shared/constants/routes.constant';
import { PLAYSTORE, ANDROID, IOS, APPSTORE } from 'src/app/shared/constants/app-constant';
import { environment } from 'src/environments/environment';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
    selector: 'app-profile-not-accessible-popup',
    templateUrl: './profile-not-accessible-popup.component.html',
    styleUrls: ['./profile-not-accessible-popup.component.scss'],
})
export class ProfileNotAccessiblePopupComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            isDesktop: boolean;
            community_id: number;
        },
        private router: Router,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {}

    close() {
        this.router.navigate([`${COMMUNITY_DETAIL_PATH}/${this.data.community_id}`]);
        this.dialogRef.close();
    }

    downloadApp(store: string) {
        const type = store === PLAYSTORE ? ANDROID : IOS;
        this.trackDownloadApp(type);
        if (store === APPSTORE) window.open(environment.appstoreLink, '_blank');
        else if (store === PLAYSTORE) window.open(environment.playstoreLink, '_blank');
    }

    download() {
        var userAgent = navigator.userAgent || navigator.vendor;

        if (/android/i.test(userAgent)) {
            this.trackDownloadApp(ANDROID);
            window.open(environment.playstoreLink, '_blank');
        }

        // if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        //     this.trackDownloadApp(IOS);
        //     window.open(environment.appstoreLink, "_blank");
        // }
    }

    trackDownloadApp(type: string) {
        this.analyticsService.sendEvent(MIXPANEL.DOWNLOAD_APP, {
            source: 'pop_up',
            type,
        });
    }
}
