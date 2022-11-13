import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CommunityFeedComponent } from './page/community-feed/community-feed.component';
import {
    CHATROOM_PATH,
    DETAIL,
    EDIT_MANAGEMENT_RIGHTS,
    GIVE_MANAGEMENT_RIGHTS,
    MEMBER_DIRECTORY_PATH,
    EDIT_MEMBER_RIGHTS,
    PROFILE,
    RENEWAL_PATH,
    CHATROOM_SETTINGS,
    BUY_MEMBERSHIP,
    VIEW_PARTICIPANTS,
    DIRECT_MESSAGE_PATH,
} from 'src/app/shared/constants/routes.constant';

import { CommunityFeedPanelComponent } from './components/community-feed-panel/community-feed-panel.component';
import { CommunityFeedHeaderComponent } from './components/community-feed-header/community-feed-header.component';
import { CommunityFeedChatroomCardComponent } from './components/community-feed-chatroom-card/community-feed-chatroom-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommunityDetailComponent } from './components/community-detail/community-detail.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PinnedListComponent } from './components/pinned-list/pinned-list.component';
import { PinnedFeedComponent } from './page/pinned-feed/pinned-feed.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { WhiteLabelGuard } from 'src/app/shared/guards/white-label.guard';

const communityFeedRoutes: Routes = [
    {
        path: ':communityId',
        component: CommunityFeedComponent,
        canActivate: [WhiteLabelGuard],
        children: [
            {
                path: CHATROOM_PATH,
                loadChildren: () => import('src/app/pages/collabcard/collabcard.module').then((m) => m.CollabcardModule),
            },
            // {
            //     path: DETAIL,
            //     loadChildren: () => import('src/app/pages/community-detail/community-detail.module').then((m) => m.CommunityDetailModule),
            // },
            // {
            //     path: MEMBER_DIRECTORY_PATH,
            //     loadChildren: () => import('src/app/pages/member-directory/member-directory.module').then((m) => m.MemberDirectoryModule),
            // },
            // {
            //     path: GIVE_MANAGEMENT_RIGHTS,
            //     loadChildren: () =>
            //         import('src/app/pages/management-rights/management-rights.module').then((m) => m.ManagementRightsModule),
            // },
            // {
            //     path: EDIT_MANAGEMENT_RIGHTS,
            //     loadChildren: () =>
            //         import('src/app/pages/edit-management-rights/edit-management-rights.module').then((m) => m.EditManagementRightsModule),
            // },
            // {
            //     path: CHATROOM_SETTINGS,
            //     loadChildren: () =>
            //         import('src/app/pages/chatroom-settings/chatroom-settings.module').then((m) => m.ChatroomSettingsModule),
            // },
            // {
            //     path: EDIT_MEMBER_RIGHTS,
            //     loadChildren: () => import('src/app/pages/member-rights/member-rights.module').then((m) => m.MemberRightsModule),
            // },
            // {
            //     path: PROFILE,
            //     loadChildren: () => import('src/app/pages/profile/profile.module').then((m) => m.ProfileModule),
            // },
            // {
            //     path: RENEWAL_PATH,
            //     loadChildren: () => import('../../pages/subscription/subscription.module').then((m) => m.SubscriptionModule),
            // },
            // {
            //     path: BUY_MEMBERSHIP,
            //     loadChildren: () => import('../buymembership/buymembership.module').then((m) => m.BuymembershipModule),
            // },
            // {
            //     path: CHATROOM_PATH + '/:chatroomId/' + VIEW_PARTICIPANTS,
            //     loadChildren: () =>
            //         import('src/app/pages/view-participants/view-participants.module').then((m) => m.ViewParticipantsModule),
            // },
        ],
    },

    {
        path: ':communityId/pinned',
        component: PinnedFeedComponent,
        children: [
            {
                path: CHATROOM_PATH,
                loadChildren: () => import('src/app/pages/collabcard/collabcard.module').then((m) => m.CollabcardModule),
            },
        ],
    },
];

@NgModule({
    declarations: [
        // CommunityFeedComponent,
        // CommunityFeedPanelComponent,
        // CommunityFeedHeaderComponent,
        // CommunityFeedChatroomCardComponent,
        // CommunityDetailComponent,
        // PinnedListComponent,
        // PinnedFeedComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(communityFeedRoutes),
        InfiniteScrollModule,
        SharedModule,
        MaterialModule,
        MatSidenavModule,
    ],
    exports: [RouterModule, MatSidenavModule],
})
export class CommunityFeedModule {}
