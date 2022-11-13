import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommunityService } from 'src/app/core/services/community.service';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';
import { UtilsService } from 'src/app/core/services/utils.service';

import { HomeFeedService } from '../../../core/services/home-feed.service';
import { CREATE_TYPE } from '../../constants/app-constant';
import { IChatroom } from '../../models/chatroom.model';
import { ICommunity, MyCommunity } from '../../models/community.model';
import { IUser } from '../../models/user.model';
import { DenyAccessComponent } from '../deny-access/deny-access.component';

@Component({
    selector: 'app-create-chatroom',
    templateUrl: './create-chatroom.component.html',
    styleUrls: ['./create-chatroom.component.scss'],
})
export class CreateChatroomComponent implements OnInit {
    private destroy$$ = new Subject();
    @Output() closeSectionComponent = new EventEmitter<Object>();
    createType = CREATE_TYPE;
    chatroom: IChatroom;
    // @Input() community: any;
    @Input() user: IUser;
    matDialogue;
    showBlankPage: boolean = false;
    creatRoomOptions: string = this.createType.NEW_CHAT_ROOM;

    myCommunities: MyCommunity[];
    createChatRoomData: any;
    memberState: any;
    community: any;
    branding: any;

    constructor(
        private homeFeedService: HomeFeedService,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private communityService: CommunityService,
        private utilsService: UtilsService,
        private sessionStorageService: SessionstorageService
    ) {}

    ngOnInit(): void {
        this.community = this.sessionStorageService.getSessionState('__community__');
        this.openCommunity();
        this.communityService.memberStateObj$$?.subscribe((data) => {
            this.memberState = data;
        });

        // this.communityService.currentCommunityData$$.subscribe((data) => {
        //     if (this.community !== data) {
        //         this.community = data;
        //     }
        // });

        setTimeout(() => {
            if (this.community) {
                const res = this.homeFeedService.subscribedCommunitiesMetaGroup$$.value;
                if (res[this.community?.id] && res[this.community?.id]?.membership_state == 1) {
                    this.matDialogue = this.dialog.open(DenyAccessComponent, {
                        data: {
                            communityName: this.community?.name,
                            id: this.community?.id,
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
                }
            }
        }, 100);

        this.communityService.currentCommunityBranding$$.pipe(takeUntil(this.destroy$$)).subscribe((branding) => {
            this.branding = branding;
        });
    }

    openCommunity() {
        const location = this.router.url.split('/');
        if (location[1] === 'community') {
            this.creatRoomOptions = this.createType.NEW_CHAT_ROOM;
            this.fetchChatroomDetails(parseInt(location[2]));
        }
    }

    chatRoomCreatedSuccess(event) {
        this.closeSectionComponent.emit(event);
    }

    roomType(type?: any) {
        if (type === false) {
            this.snackbar.open(`You don't have permision to create chatroom here.`, null, {
                duration: 5000,
                panelClass: ['snackbar'],
            });
            return;
        }
        this.creatRoomOptions = type;
    }

    selectedCommunityInfo(event) {
        this.creatRoomOptions = this.createType.NEW_CHAT_ROOM;
        this.community = event;
    }

    // Get all community list
    getCommunities() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.myCommunities = response;
        });
    }

    fetchChatroomDetails(communityId: number) {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((communityList) => {
            let data = communityList.find((community) => community.id === communityId);

            if (!data.member_right_states.includes(0)) {
                this.snackbar.open(`You don't have permision to create chatroom here.`, null, {
                    duration: 5000,
                    panelClass: ['snackbar'],
                });
                this.closeSectionComponent.emit('created');
                return;
            }
            if (data) this.community = data;
        });
    }
}
