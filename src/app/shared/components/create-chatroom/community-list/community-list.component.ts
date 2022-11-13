import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { IUser } from '../../../../shared/models/user.model';
import { CommunityService } from '../../../../core/services/community.service';
import { MatDialog } from '@angular/material/dialog';
import { DenyAccessComponent } from '../../deny-access/deny-access.component';
import { UtilsService } from 'src/app/core/services//utils.service';
@Component({
    selector: 'app-community-list',
    templateUrl: './community-list.component.html',
    styleUrls: ['./community-list.component.scss'],
})
export class CommunityListComponent implements OnInit {
    @Input() communitiesList: any;
    @Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
    memberState: any;
    user: IUser;
    showBlankPage: boolean = false;
    matDialogue;

    constructor(
        private localStorageService: LocalStorageService,
        private snackbar: MatSnackBar,
        private communityService: CommunityService,
        private homeFeedService: HomeFeedService,
        private dialog: MatDialog,
        private utilsService: UtilsService
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        setTimeout(() => {
            if (this.communitiesList.length === 1) {
                if (!this.communitiesList[0].member_right_states.includes(0)) {
                    this.snackbar.open(`You don't have permision to create chatroom here.`, null, {
                        duration: 5000,
                        panelClass: ['snackbar'],
                    });
                    return;
                }

                this.selecteCommunity(this.communitiesList[0]);
            }
        }, 300);
    }

    selecteCommunity(communityData) {
        this.getUserStatus(communityData.id, this.user.id);

        this.homeFeedService.subscribedCommunitiesMetaGroup$$.subscribe((res) => {
            if (res[communityData?.id] && res[communityData?.id]?.membership_state == 1) {
                this.matDialogue = this.dialog.open(DenyAccessComponent, {
                    data: {
                        communityName: communityData?.name,
                        id: communityData?.id,
                    },
                });
                this.showBlankPage = true;
                this.homeFeedService.backgroundBackdropEnabled$$.next(true);
                this.utilsService.closeMatDialogBox$$.subscribe((res) => {
                    if (res) {
                        this.matDialogue.close();
                        this.showBlankPage = false;
                        this.utilsService.closeMatDialogBox$$.next(false);
                        this.homeFeedService.backgroundBackdropEnabled$$.next(false);
                    }
                });

                return;
            } else if (!communityData.member_right_states.includes(0)) {
                this.snackbar.open(`You don't have permision to create chatroom here.`, null, {
                    duration: 5000,
                    panelClass: ['snackbar'],
                });
                return;
            }
            this.selectedCommunity.emit(communityData);
        });
    }

    getUserStatus(community_id: number | string, member_id: number | string) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe((response) => {
            this.memberState = response;
            this.communityService.memberStateObj$$.next(this.memberState);
        });
    }
}
