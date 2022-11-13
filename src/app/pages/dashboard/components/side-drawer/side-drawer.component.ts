import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { MyCommunity } from '../../../../shared/models/community.model';
import { IUser } from '../../../../shared/models/user.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { CookieService } from 'ngx-cookie-service';
import { LeaveCommunityComponent } from 'src/app/shared/entryComponents/leave-community/leave-community.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { ACCOUNT, DIRECT_MESSAGE_MEMBER_PATH, DIRECT_MESSAGE_PATH, ROOT_PATH } from 'src/app/shared/constants/routes.constant';
import { PaymentModalDialogComponent } from 'src/app/shared/entryComponents/payment-modal-dialog/payment-modal-dialog.component';
import { APPROVAL_PENDING_TEXT, APPSTORE, COMMMUNITY_OPENED, PLAYSTORE } from 'src/app/shared/constants/app-constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDevice } from 'src/app/shared/utils';
import { CommunityService } from 'src/app/core/services/community.service';

@Component({
    selector: 'app-side-drawer',
    templateUrl: './side-drawer.component.html',
    styleUrls: ['./side-drawer.component.scss'],
})
export class SideDrawerComponent implements OnInit {
    @Output() toggleDrawer: EventEmitter<any> = new EventEmitter();

    user: IUser;
    is_cm: Boolean;
    myCommunities: MyCommunity[];
    isAndroid: boolean;
    storeUrl: string;
    admin_community_ids = [];
    private destroy$$ = new Subject();
    mySubscribedCommunitiesMeta = [];
    expiredOrExpiringCommunityCount = 0;
    bottomMenuOptions: any[] = [];
    createNewCommunityValue = 'Create New Community';
    joinNewCommunityValue = 'Join new community';
    joinNewCommunity: boolean = false;
    communityClickState: string = '';
    currentCommunityData: any = null;

    constructor(
        private homeFeedService: HomeFeedService,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private router: Router,
        private chatRoomService: ChatroomService,
        private cookieService: CookieService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private utilsService: UtilsService,
        private subscriptionService: SubscriptionService,
        private chatroomService: ChatroomService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.getCommunities();
        this.identifyDevice();
        this.subscribedCommunitiesMeta();
        this.getBottomMenu();

        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (!_.isEqual(this.currentCommunityData, data)) this.currentCommunityData = data;
        });
    }
    // this.localStorageService.setSavedState(false , STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
    // this.subscriptionService.showMySubscriptions$$.next(false);

    openJoinCommunityModal() {
        this.toggleDrawer.emit();
        this.dialog.open(PaymentModalDialogComponent, {
            data: {
                showExpiredCommunityPopup: false,
            },
            panelClass: 'modal-white-background',
        });
    }

    getBottomMenu() {
        this.homeFeedService
            .getHomeDrawerBottomMenu()
            .pipe(takeUntil(this.destroy$$))
            .subscribe((response) => {
                this.bottomMenuOptions = response?.menu?.filter(
                    (m) => m?.title !== this.createNewCommunityValue && m?.title !== this.joinNewCommunityValue
                );
                response?.menu?.forEach((option) => {
                    if (option?.title === this.joinNewCommunityValue) this.joinNewCommunity = true;
                });
            });
    }

    getCommunities() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.myCommunities = response;
            let openedCommunity = this.cookieService?.check(COMMMUNITY_OPENED) ? +this.cookieService?.get(COMMMUNITY_OPENED) : null;
            this.myCommunities.map((community: any) => {
                if (community.member_state === 1 && community.is_paid) {
                    this.is_cm = true;
                    this.admin_community_ids.push(community.id);
                    return;
                }

                if (community?.click_state) {
                    switch (community?.click_state) {
                        case 2:
                            community.click_state_value = 'Approval pending';
                            break;
                        case 3:
                            community.click_state_value = 'Community not set up';
                            break;
                        case 4:
                            community.click_state_value = 'Community profile not set up';
                            break;
                        default:
                            community.click_state_value = '';
                            break;
                    }
                }
            });
            let path = window.location.pathname;

            if (path?.split('/')[1] == DIRECT_MESSAGE_PATH || path?.split('/')[1] == DIRECT_MESSAGE_MEMBER_PATH) {
                const currentCommunityIdx = this.myCommunities.findIndex((community: any) => community.id === parseInt(path.split('/')[2]));
                if (this.isNumeric(path.split('/')[2]) && this.myCommunities[currentCommunityIdx]) {
                    this.cookieService.delete(COMMMUNITY_OPENED);
                    this.cookieService.set(COMMMUNITY_OPENED, path.split('/')[2]);
                    this.communityService.currentCommunityData$$.next(this.myCommunities[currentCommunityIdx]);
                }
            } else if (path?.split('/')[1] == 'event_feed' || path?.split('/')[1] == 'community_feed' || path?.split('/')[1] == 'renewal') {
                const currentCommunityIdx = this.myCommunities.findIndex((community: any) => community.id === parseInt(path.split('/')[2]));
                if (this.isNumeric(path.split('/')[2]) && this.myCommunities[currentCommunityIdx]) {
                    this.cookieService.delete(COMMMUNITY_OPENED);
                    this.cookieService.set(COMMMUNITY_OPENED, path.split('/')[2]);
                    this.communityService.currentCommunityData$$.next(this.myCommunities[currentCommunityIdx]);
                }
            } else {
                if (openedCommunity) {
                    const currentCommunityIdx = this.myCommunities.findIndex((community: any) => community.id === openedCommunity);

                    if (currentCommunityIdx >= 0 && !this.myCommunities[currentCommunityIdx].click_state)
                        this.communityService.currentCommunityData$$.next(this.myCommunities[currentCommunityIdx]);
                    else this.setInitialCurrentCommunity(this.myCommunities);
                } else this.setInitialCurrentCommunity(this.myCommunities);
            }
        });
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    setInitialCurrentCommunity(communities) {
        const initialValidCommunityIdx = communities?.findIndex((community) => !community?.click_state);
        if (initialValidCommunityIdx >= 0) {
            // this.localStorageService.setSavedState(communities[initialValidCommunityIdx]?.id, COMMMUNITY_OPENED);
            this.cookieService.delete(COMMMUNITY_OPENED);
            this.cookieService.set(COMMMUNITY_OPENED, communities[initialValidCommunityIdx]?.id);
            this.communityService?.currentCommunityData$$?.next(communities[initialValidCommunityIdx]);
            this.router.navigate([`/${communities[initialValidCommunityIdx]?.id}`]);
        }
    }

    openLink(key): void {
        if (!key) return;

        if (key === PLAYSTORE) window.open(environment.playstoreLink, '_blank');
        else if (key === APPSTORE) window.open(environment.appstoreLink, '_blank');
    }

    subscribedCommunitiesMeta() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.mySubscribedCommunitiesMeta = response;
            this.myCommunities?.forEach((community: any) => {
                if (!community?.click_state) {
                    const memberShipState = this.mySubscribedCommunitiesMeta[community?.id]?.membership_state;
                    switch (memberShipState) {
                        case 1:
                        case 2:
                            community.click_state_subscription_value = 'Membership expired';
                            break;
                        case 3:
                            community.click_state_subscription_value = 'Renewal due';
                            break;
                        default:
                            community.click_state_subscription_value = '';
                            break;
                    }
                }
            });
            this.checkMembershipState();
        });
    }

    checkMembershipState() {
        let totCount = 0;
        Object.values(this.mySubscribedCommunitiesMeta).forEach((communityMeta) => {
            if (communityMeta.membership_state == 1 || communityMeta.membership_state == 2 || communityMeta.membership_state == 3) {
                totCount += 1;
            }
        });
        this.expiredOrExpiringCommunityCount = totCount;
    }

    identifyDevice() {
        var userAgent = navigator.userAgent || navigator.vendor;

        if (/android/i.test(userAgent)) {
            this.isAndroid = true;
            this.storeUrl = environment.playstoreLink;
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MediaStream) {
            this.isAndroid = false;
            this.storeUrl = environment.appstoreLink;
        }
    }

    markActive() {
        let isAnyChatroomOpened = this.localStorageService.getSavedState(STORAGE_KEY.CHATROOM_OPENED);
        this.hideMediaPopup();
        if (this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID) && isAnyChatroomOpened) {
            let chatroomId = this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID);
            this.chatroomService.markRead(`chatroom_id=${chatroomId}`).subscribe((_) => {});
        }
        this.localStorageService.setSavedState(false, STORAGE_KEY.CHATROOM_OPENED);
        this.localStorageService.setSavedState(false, STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
        this.subscriptionService.showMySubscriptions$$.next(false);
    }

    hideMediaPopup(): void {
        this.chatRoomService.closeMediaPopup$$.next(false);
    }

    openCommunity(community) {
        this.toggleDrawer.emit();
        this.markActive();
        this.subscriptionService.showMySubscriptions$$.next(false);
        if (!community?.click_state) {
            this.cookieService.delete(COMMMUNITY_OPENED);
            this.cookieService?.set(COMMMUNITY_OPENED, community?.id);
        }
        if (community?.click_state === 2) {
            this.router.navigate([`/community_feed/${community?.id}`]);
            if (getDevice() === 'mobile')
                this.snackBar.open(APPROVAL_PENDING_TEXT, null, {
                    duration: 3000,
                    panelClass: ['black-bottom-snackbar'],
                });
            else
                this.snackBar.open(APPROVAL_PENDING_TEXT, 'OK', {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
                });
        } else if (community?.click_state === 4) this.router.navigate([`/community_feed/${community?.id}`]);
        else this.router.navigate([`/${community?.id}`]);
    }

    openStore() {
        window.open(this.storeUrl, '_blank');
    }

    openLeaveCommunityPopup(community) {
        let dialogue = this.dialog.open(LeaveCommunityComponent, {
            data: {
                data: this.user,
                task: 'leaveCommunityPopupMobile',
                commmunityId: community?.id,
                community: community,
            },
        });

        this.utilsService.closeMatDialogBox$$.subscribe((res) => {
            if (res) {
                dialogue.close();
                this.utilsService.closeMatDialogBox$$.next(false);
            }
        });
    }

    openJoinCodeModal(): void {
        this.toggleDrawer.emit();
        this.dialog.open(PaymentModalDialogComponent, {
            data: {
                showExpiredCommunityPopup: false,
                // community : this.community
            },
        });
    }

    getMySubscription(): void {
        this.toggleDrawer.emit();
        this.router.navigate([`${ROOT_PATH}`]);
        this.subscriptionService.showMySubscriptions$$.next(true);
    }

    openAccount(): void {
        this.toggleDrawer.emit();
        this.router.navigate([`/${ACCOUNT}`]);
    }

    onLogout() {
        localStorage.clear();
        sessionStorage.clear();
        // this.cookieService.deleteAll();
        this.hideMediaPopup();
        this.authService.logout();
        this.router.navigate(['auth']);
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}
