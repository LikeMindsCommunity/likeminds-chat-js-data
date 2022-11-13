import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { State } from 'src/app/shared/store/reducers';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { CommunityService } from '../../../../core/services/community.service';
import { ICommunity } from '../../../../shared/models/community.model';
import { IMemberState } from '../../../../shared/models/member.model';
import { IUser } from '../../../../shared/models/user.model';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { COMMUNITY_QUESTION_PATH } from 'src/app/shared/constants/routes.constant';
import { CHATROOM_TYPE_MAP } from 'src/app/shared/constants/app-constant';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { MatDialog } from '@angular/material/dialog';
import { LeaveCommunityComponent } from 'src/app/shared/entryComponents/leave-community/leave-community.component';
import { EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';

@Component({
    selector: 'app-community-detail',
    templateUrl: './community-detail.component.html',
    styleUrls: ['./community-detail.component.scss'],
})
export class CommunityDetailComponent implements OnInit, OnChanges {
    screenType: string;
    @Input() communityId: number;
    @Input() community: ICommunity;
    @Input() memberState: IMemberState;
    @Input() subscribedCommunity: any;
    @Input() membershipState: any;
    @Input() buyMembershipUrl: string;
    @Input() chatroom_type: string | number;
    @Output() hideOverlay = new EventEmitter();
    @Output() hideChatroomDetailEmitter = new EventEmitter();

    admins: IUser[];
    user: IUser;
    chatroom: IChatroom;
    accessibleWithoutSubscription: boolean;
    membershipIsExpired: boolean;

    constructor(
        private router: Router,
        private store: Store<State>,
        private communityService: CommunityService,
        private localStorageService: LocalStorageService,
        private dialog: MatDialog,
        private utilsService: UtilsService,
        private chatroomService: ChatroomService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        setTimeout(() => {
            if (this.community) this.getCommunityAdmins(this.community?.id);
        }, 2000);
        this.chatroomService.accessibleWithoutSubscription$$.subscribe((res) => {
            this.accessibleWithoutSubscription = res;
        });
        this.chatroomService.membershipIsExpired$$.subscribe((res) => {
            this.membershipIsExpired = res;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {}

    storeUrl() {
        this.route.queryParams.subscribe((res) => {
            this.localStorageService.setSavedState({ path: location.pathname, queryParams: res }, STORAGE_KEY.URL_PATTERN);
            console.log(this.localStorageService.getSavedState(STORAGE_KEY.URL_PATTERN));
        });
    }

    goToLogin() {
        this.router.navigate(['auth']);
        this.storeUrl();
    }

    joinCommunity() {
        if (!this.memberState) return;
        if (this.user) {
            this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], {
                queryParams: {
                    source_chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type] || '',
                    source_chatroom_name: this.chatroom?.header || '',
                },
            });
            return;
        }
        if (!this.memberState.state) {
            this.store.pipe(select(getRedirectUrl)).subscribe((url) => {
                if (url) {
                    localStorage.setItem(STORAGE_KEY.JOIN_COMMUNITY, JSON.stringify(true));
                    if (url.includes('?')) url = `${url}&page=join_community`;
                    else url = `${url}?page=join_community`;
                    this.router.navigateByUrl(`${url}`);
                } else {
                    this.router.navigateByUrl('/auth');
                }
            });
        }
    }

    hideChatroomOverlay() {
        this.hideOverlay.emit('true');
    }

    openLeaveCommunityPopup() {
        let dialogue = this.dialog.open(LeaveCommunityComponent, {
            data: {
                data: this.user,
                task: 'leaveCommunityPopup',
                state: this.memberState.state,
                commmunityId: this.communityId,
                membershipState: this.membershipState,
            },
            panelClass: 'leave-community-bg',
        });
        this.utilsService.closeMatDialogBox$$.subscribe((res) => {
            if (res) {
                dialogue.close();
                this.utilsService.closeMatDialogBox$$.next(false);
            }
        });
    }

    getCommunityAdmins(community_id: number | string) {
        this.communityService.getCommunityAdminList({ community_id }).subscribe((response) => {
            this.admins = response.members;
        });
    }

    hideChatroomDetail() {
        this.hideChatroomDetailEmitter.emit(true);
        this.chatroomService.showNewChatroomCommunityDetail$$.next(false);
    }

    openRenewal() {
        if (this.screenType === 'mobile') {
            this.router.navigate(['/renewal/' + this.community.id], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate(['/community_feed/' + this.community.id + '/renewal/' + this.community.id], {
                queryParams: { renew: 'true', user_id: this.user.id },
            });
        }
    }

    openPaymentPage() {
        if (this.buyMembershipUrl.substring(0, 8) !== 'https://') {
            this.buyMembershipUrl = 'https://' + this.buyMembershipUrl;
        }
        window.location.href = this.buyMembershipUrl;
    }
}
