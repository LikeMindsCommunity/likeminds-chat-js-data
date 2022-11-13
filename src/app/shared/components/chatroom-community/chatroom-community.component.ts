import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ICommunity } from 'src/app/shared/models/community.model';
import { IUser } from 'src/app/shared/models/user.model';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { IMemberState } from 'src/app/shared/models/member.model';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { COMMUNITY_QUESTION_PATH } from '../../constants/routes.constant';
import { CHATROOM_TYPE_MAP } from '../../constants/app-constant';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { MIXPANEL } from '../../enums/mixpanel.enum';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

@Component({
    selector: 'chatroom-community-detail',
    templateUrl: './chatroom-community.component.html',
    styleUrls: ['./chatroom-community.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatroomCommunityComponent implements OnInit {
    @Input() chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() admins: IUser[];
    @Input() user: IUser;
    @Input() memberState: IMemberState;
    nonMember: any;

    constructor(
        private store: Store<State>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private analyticsService: AnalyticsService,
        private localStorageService: LocalStorageService
    ) {}

    ngOnInit() {
        this.nonMember = this.localStorageService.getSavedState('nonMemberEvent');
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
                localStorage.setItem(STORAGE_KEY.JOIN_COMMUNITY, JSON.stringify(true));
                if (url) {
                    if (url.includes('?')) url = `${url}&page=join_community`;
                    else url = `${url}?page=join_community`;
                    this.router.navigateByUrl(`${url}`);
                } else {
                    this.storeUrl();
                    this.router.navigateByUrl(`/auth`);
                }
            });
        }
    }

    viewedDirectory() {
        this.storeUrl();
        this.analyticsService.sendEvent(MIXPANEL.VIEWED_DIRECTORY, {
            community_id: this.community?.id,
            member_id: this.user?.id,
        });
    }

    storeUrl() {
        this.activatedRoute.queryParams.subscribe((res) => {
            localStorage.setItem('chatroomRedirect', JSON.stringify({ path: location.pathname, queryParams: res }));
        });
    }
}
