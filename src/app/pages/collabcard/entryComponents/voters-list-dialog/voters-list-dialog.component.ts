import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { COMMUNITY_FEED_PATH, PROFILE } from 'src/app/shared/constants/routes.constant';
import { ProfileNotExistPopupComponent } from 'src/app/shared/entryComponents/profile-not-exist-popup/profile-not-exist-popup.component';
import { MIXPANEL, SOURCE } from 'src/app/shared/enums/mixpanel.enum';
import { QUESTION_STATE } from 'src/app/shared/enums/questions-state.enum';

@Component({
    selector: 'app-voters-list-dialog',
    templateUrl: './voters-list-dialog.component.html',
    styleUrls: ['./voters-list-dialog.component.scss'],
})
export class VotersListDialogComponent implements OnInit {
    polls: any;
    poll_users: any;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private dialog: MatDialogRef<VotersListDialogComponent>,
        private analyticsService: AnalyticsService,
        private router: Router,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        if (this.data.type === 'conversation') this.fetchConversation(this.data.conversation_id);
        else if (this.data.type === 'chatroom') this.fetchChatroom(this.data.chatroom_id);
    }

    close() {
        this.dialog.close();
    }

    getWidth() {
        return `calc(100% / ${this.polls.length >= 4 ? 3.5 : this.polls.length})`;
    }

    openProfile(host: any) {
        if (host) {
            if (host.custom_click_text) {
                this.matDialog.open(ProfileNotExistPopupComponent, {
                    data: {
                        message: host.custom_intro_text,
                    },
                });
            } else {
                this.router.navigate([`/${COMMUNITY_FEED_PATH}/${host.community_id}/${PROFILE}/${host.id}`]);

                // Mixpanel event
                this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
                    community_id: host.community_id,
                    viewed_member_id: host.id,
                    viewed_member_state: host.state,
                    source: SOURCE.CHATROOM,
                });

                this.close();
            }
        }
    }

    getIntroduction(i) {
        const answer = this.poll_users[i]?.question_answers?.find((q) => q.state === QUESTION_STATE.INTRODUCTION);
        return answer?.value;
    }

    fetchConversation(id: string) {
        this.chatroomService.fetchConversation(id).subscribe((res) => {
            this.polls = res?.conversations[0].polls.map((p) => {
                if (p.id === this.data.poll_id) {
                    p.selected = true;
                    this.fetchPollUsers(p.id);
                }
                return p;
            });
        });
    }

    fetchChatroom(id: string) {
        this.chatroomService.fetchChatroom(id).subscribe((res) => {
            this.polls = res?.chatroom.polls.map((p) => {
                if (p.id === this.data.poll_id) {
                    p.selected = true;
                    this.fetchPollUsers(p.id);
                }
                return p;
            });
        });
    }

    switchPoll(poll_id: string) {
        this.polls = this.polls.map((p) => {
            p.selected = false;
            if (p.id === poll_id) {
                p.selected = true;
                this.fetchPollUsers(p.id);
            }
            return p;
        });
    }

    fetchPollUsers(poll_id: string) {
        if (this.data.type === 'conversation')
            this.homeFeedService.fetchMicropollUsers(this.data.conversation_id, poll_id).subscribe((res) => {
                this.poll_users = res.members;
            });
        else if (this.data.type === 'chatroom')
            this.chatroomService.fetchPollUsers(this.data.chatroom_id, poll_id).subscribe((res) => {
                this.poll_users = res.members;
            });
    }
}
