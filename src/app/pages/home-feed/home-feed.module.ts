import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HomeFeedComponent } from './page/home-feed/home-feed.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import {
    ADD_PARTICIPANTS,
    CHATROOM_PATH,
    CHATROOM_SETTINGS,
    HISTORY_PATH,
    ROOT_PATH,
    VIEW_PARTICIPANTS,
} from 'src/app/shared/constants/routes.constant';
// import { HomeFeedPanelComponent } from './components/home-feed-panel/home-feed-panel.component';
// import { FeedChatroomCardComponent } from './components/feed-chatroom-card/feed-chatroom-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionHistoryComponent } from 'src/app/shared/components/subscription-history/subscription-history.component';
import { CommunityDetailComponent } from './components/community-detail/community-detail.component';
import { HomePageProfileDrawerComponent } from 'src/app/shared/components/home-page-profile-drawer/home-page-profile-drawer.component';
import { UpgradeMembershipBottomSheetComponent } from './entryComponents/upgrade-membership-bottom-sheet/upgrade-membership-bottom-sheet.component';
import { MatDialogModule } from '@angular/material/dialog';
// import { HomePageProfileDrawerComponent } from './components/home-page-profile-drawer/home-page-profile-drawer.component';

const homeFeedRoutes: Routes = [
    // {
    //     path: ROOT_PATH,
    //     component: HomeFeedComponent,
    //     children: [
    //         {
    //             path: CHATROOM_PATH,
    //             loadChildren: () => import('src/app/pages/collabcard/collabcard.module').then((m) => m.CollabcardModule),
    //         },
    //         {
    //             path: HISTORY_PATH,
    //             component: SubscriptionHistoryComponent,
    //         },
    //     ],
    // },
];

@NgModule({
    declarations: [
        // HomeFeedPanelComponent,
        // FeedChatroomCardComponent,
        // HomePageProfileDrawerComponent,
        CommunityDetailComponent,
        // UpgradeMembershipBottomSheetComponent,
    ],
    imports: [CommonModule, RouterModule.forChild(homeFeedRoutes), SharedModule, InfiniteScrollModule, MatSidenavModule, MatDialogModule],
    exports: [RouterModule, MatSidenavModule],
})
export class HomeFeedModule {}
