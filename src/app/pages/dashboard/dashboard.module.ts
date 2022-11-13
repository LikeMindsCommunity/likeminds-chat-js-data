import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { A11yModule } from '@angular/cdk/a11y';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { HeaderComponent } from './components/header/header.component';
// import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import {
    ACCOUNT,
    COMMUNITY_FEED_PATH,
    EVENT_FEED_PATH,
    RENEWAL_PATH,
    ROOT_PATH,
    DIRECT_MESSAGE_PATH,
    SINGLE_EVENT,
    DIRECT_MESSAGE_MEMBER_PATH,
} from '../../shared/constants/routes.constant';
import { SideDrawerComponent } from './components/side-drawer/side-drawer.component';
import { WhiteLabelGuard } from 'src/app/shared/guards/white-label.guard';
import { SingleEventRedirectionComponent } from './components/single-event-redirection/single-event-redirection.component';
import { ConfirmBlockDialogComponent } from '../collabcard/components/confirm-block-dialog/confirm-block-dialog.component';
import { HomeFeedSearchListComponent } from './components/home-feed-search-list/home-feed-search-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HomeFeedSearchMobileComponent } from './components/home-feed-search-mobile/home-feed-search-mobile.component';
import { HomeFeedSearchDesktopComponent } from './components/home-feed-search-desktop/home-feed-search-desktop.component';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
    // {
    //     path: ROOT_PATH,
    //     component: DashboardComponent,
    //     children: [
    //         {
    //             path: ':communityId',
    //             loadChildren: () => import('src/app/pages/home-feed/home-feed.module').then((m) => m.HomeFeedModule),
    //             canActivate: [WhiteLabelGuard],
    //         },
    //         {
    //             path: '',
    //             loadChildren: () => import('src/app/pages/home-feed/home-feed.module').then((m) => m.HomeFeedModule),
    //         },
    //     ],
    // },
];

@NgModule({
    declarations: [
        // LeftPanelComponent,
        HeaderComponent,
        SideDrawerComponent,
        SingleEventRedirectionComponent,
        HomeFeedSearchListComponent,
        HomeFeedSearchMobileComponent,
        HomeFeedSearchDesktopComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        MatSidenavModule,
        // SharedModule,
        InfiniteScrollModule,
        MaterialModule,
        A11yModule,
    ],
    exports: [RouterModule, HeaderComponent],
})
export class DashboardModule {}
