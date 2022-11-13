import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';

@Component({
    selector: 'app-deny-access',
    templateUrl: './deny-access.component.html',
    styleUrls: ['./deny-access.component.scss'],
})
export class DenyAccessComponent implements OnInit {
    screenType;
    user;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private localStorageService: LocalStorageService,
        private router: Router,
        private utilsService: UtilsService,
        private homeFeedService: HomeFeedService
    ) {}

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    }

    closeModal() {
        this.utilsService.closeMatDialogBox$$.next(true);
    }

    openRenewal() {
        this.closeModal();
        this.homeFeedService.backgroundBackdropEnabled$$.next(false);
        if (this.screenType === 'mobile') {
            this.router.navigate(['/renewal/' + this.data?.id], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate(['/community_feed/' + this.data?.id + '/renewal/' + this.data?.id], {
                queryParams: { renew: 'true', user_id: this.user.id },
            });
        }
    }
}
