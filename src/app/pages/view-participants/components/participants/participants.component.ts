import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommunityService } from 'src/app/core/services/community.service';

import { CreateChatroomService } from 'src/app/core/services/create-chatroom.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { MemberDirectoryService } from 'src/app/core/services/member-directory.service';
import { ModerationService } from 'src/app/core/services/moderation.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { RemoveParticipantsDialogComponent } from '../../entryComponents/remove-participants-dialog/remove-participants-dialog.component';

@Component({
    selector: 'participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {
    private destroy$$ = new Subject();

    chatroom: any;
    participantsList: any;
    cmId: number;
    crId: any;
    user: any;
    memberPage: number = 1;
    currentCommunityData: any = null;

    constructor(
        private memberDirectoryService: MemberDirectoryService,
        private createChatroomService: CreateChatroomService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private localStorageService: LocalStorageService,
        private moderationService: ModerationService,
        private analyticsService: AnalyticsService,
        private communityService: CommunityService
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.getChatroomDetail(this.activatedRoute.snapshot.paramMap.get('chatroomId'));
        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== this.currentCommunityData) this.currentCommunityData = data;
        });
    }

    getChatroomDetail(chatroomId: number | string) {
        this.createChatroomService.getChatroomDetail(chatroomId).subscribe((resData) => {
            if (resData) {
                this.chatroom = resData.chatroom;
                this.cmId = resData.chatroom.community_id;
                this.crId = resData.chatroom.id;
                this.onShowMemberList(this.crId, this.cmId);
                this.getCommunityManager(this.cmId);
            }
        });
    }

    is_cm: boolean = false;
    getCommunityManager(cid: number) {
        const params = {
            community_id: cid,
            user_id: this.user?.id,
        };

        this.moderationService.getManagerRight(params).subscribe((res) => {
            if (res?.member?.state === 1) {
                this.is_cm = true;
            } else {
                this.is_cm = false;
            }
        });
    }
    memberList: any = [];
    stopPagination: boolean = true;
    onShowMemberList(crId: number, cmId: number) {
        this.memberDirectoryService
            .getAllMembers({
                page: this.memberPage,
                community_id: cmId,
                chatroom_id: crId,
            })
            .subscribe((resData) => {
                this.participantsList = resData;
                this.memberList.push(...this.participantsList.members);
                if (this.participantsList?.total_members > 10) {
                    if (this.participantsList?.members?.length >= 10) {
                        this.memberPage++;
                        this.stopPagination = true;
                    } else {
                        this.stopPagination = false;
                    }
                } else {
                    this.stopPagination = false;
                }

                // MixPanel: Participants added list
                this.analyticsService.sendEvent(MIXPANEL.PARTICIPANTS_ADDED, {
                    community_id: cmId,
                    chatroom_id: this.chatroom.id,
                    chatroom_name: this.chatroom.header,
                    no_of_participants: this.participantsList?.total_members,
                });
            });
    }

    onScroll() {
        if (this.stopPagination) {
            this.onShowMemberList(this.crId, this.cmId);
        }
    }

    userAction(action: string, member: any) {
        if (action === 'view profile') this.viewProfile(member?.id);
        else {
            this.removeMemberDialog(member);
        }
    }

    removeMemberDialog(member: any) {
        this.dialog
            .open(RemoveParticipantsDialogComponent, {
                data: {
                    name: member?.name,
                },
                panelClass: 'secretCRDialog',
            })
            .afterClosed()
            .subscribe((res) => {
                if (res) {
                    this.onRemoveMember(member);
                }
            });
    }

    onRemoveMember(member: any) {
        const params = {
            chatroom_id: this.crId,
            member_id: member.id,
        };

        this.createChatroomService
            .removeParticipants(params)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((resData) => {
                this.snackbar.open(`${member.name} removed from this chatroom`, 'OK', {
                    duration: 4000,
                    panelClass: ['snackbar'],
                    horizontalPosition: 'left',
                });

                // MixPanel: Remove Participants
                this.analyticsService.sendEvent(MIXPANEL.PARTICIPANTS_REMOVED, {
                    community_id: this.chatroom.community_id,
                    chatroom_id: this.chatroom.id,
                    chatroom_name: this.chatroom.header,
                    removed_user_id: member.id,
                });
                this.memberList = [];
                this.getChatroomDetail(this.activatedRoute.snapshot.paramMap.get('chatroomId'));
            });
    }

    viewProfile(uId: any) {
        this.router.navigateByUrl(`/community_feed/${this.cmId}/profile/${uId}`);
    }

    goTopage() {
        this.router.navigateByUrl(
            `/${this.currentCommunityData?.id}/collabcard/${this.activatedRoute.snapshot.paramMap.get('chatroomId')}/add_participants`
        );
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}
