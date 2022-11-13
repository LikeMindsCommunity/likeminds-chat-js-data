import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ChatroomPanelComponent } from './pages/collabcard/components/chatroom-panel/chatroom-panel.component';
import { ChatroomComponent } from './pages/collabcard/page/chatroom/chatroom.component';
import { CommunityFeedComponent } from './pages/community-feed/page/community-feed/community-feed.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeFeedComponent } from './pages/home-feed/page/home-feed/home-feed.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/pages/profile/profile.component';
import { ViewParticipantsComponent } from './pages/view-participants/page/view-participants/view-participants.component';
import { CHATROOM_PATH, COMMUNITY_FEED_PATH, PROFILE, ROOT_PATH, VIEW_PARTICIPANTS } from './shared/constants/routes.constant';
import { AuthLoginGuard } from './shared/guards/auth-login.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { WhiteLabelGuard } from './shared/guards/white-label.guard';

const appRoutes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: ROOT_PATH,
        component: DashboardComponent,
        // canActivate: [AuthGuard],
        children: [
            {
                path: ':communityId',
                canActivate: [WhiteLabelGuard],
                component: HomeFeedComponent,
                children: [
                    {
                        path: CHATROOM_PATH,
                        component: ChatroomComponent,
                        children: [
                            {
                                path: ':chatroomId',
                                component: ChatroomPanelComponent,
                            },
                            {
                                path: VIEW_PARTICIPANTS,
                                component: ViewParticipantsComponent,
                            },
                        ],
                    },
                ],
            },
            {
                path: COMMUNITY_FEED_PATH + '/:communityId',
                component: CommunityFeedComponent,
                children: [
                    {
                        path: CHATROOM_PATH + '/:chatroomId',
                        component: ChatroomComponent,
                        children: [
                            {
                                path: ROOT_PATH,
                                component: ChatroomPanelComponent,
                            },
                            {
                                path: VIEW_PARTICIPANTS,
                                component: ViewParticipantsComponent,
                            },
                        ],
                    },
                ],
            },
            {
                path: COMMUNITY_FEED_PATH + '/:communityId/' + PROFILE + '/:userId',
                component: ProfileComponent,
            },
        ],
    },

    // {
    //     path: CHATROOM_PATH + '/:chatroomId/' + VIEW_PARTICIPANTS,
    //     loadChildren: () =>
    //         import('src/app/pages/view-participants/view-participants.module').then((m) => m.ViewParticipantsModule),
    // },

    // {
    //     path: '404',
    //     component: NotFoundComponent,
    // },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            relativeLinkResolution: 'legacy',
            scrollPositionRestoration: 'enabled',
        }),
    ],
    // imports: [
    //     RouterModule.forRoot(appRoutes, {
    //         initialNavigation: 'enabled',
    //         scrollPositionRestoration: 'enabled',
    //         relativeLinkResolution: 'legacy',
    //     }),
    // ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
