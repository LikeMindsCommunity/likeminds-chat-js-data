import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './pages/profile/profile.component';
import { ROOT_PATH } from 'src/app/shared/constants/routes.constant';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ReportMemberPopupComponent } from './entryComponents/report-member-popup/report-member-popup.component';
import { MemberReportedPopupComponent } from './entryComponents/member-reported-popup/member-reported-popup.component';
import { ImageCropperComponent } from './entryComponents/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageChooserComponent } from './entryComponents/image-chooser/image-chooser.component';
import { ProfileNotAccessiblePopupComponent } from './entryComponents/profile-not-accessible-popup/profile-not-accessible-popup.component';
import { ChatroomOptionsSheetComponent } from './entryComponents/chatroom-options-sheet/chatroom-options-sheet.component';
import { ReportPageComponent } from './pages/components/report-page/report-page.component';
import { EditProfileGuard } from 'src/app/shared/guards/edit-profile.guard';
import { MobileImageCropperComponent } from './components/mobile-image-cropper/mobile-image-cropper.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { RemoveProfileComponent } from './entryComponents/remove-profile/remove-profile.component';

const profileRoute: Routes = [
    {
        path: ROOT_PATH,
        component: ProfileComponent,
    },
    {
        path: 'edit',
        component: EditProfileComponent,
        canActivate: [EditProfileGuard],
    },
];

@NgModule({
    declarations: [
        // ProfileComponent,
        // EditProfileComponent,
        // ReportMemberPopupComponent,
        // MemberReportedPopupComponent,
        // ImageCropperComponent,
        // ImageChooserComponent,
        // ProfileNotAccessiblePopupComponent,
        // ChatroomOptionsSheetComponent,
        // ReportPageComponent,
        // MobileImageCropperComponent,
        // RemoveProfileComponent,
    ],
    imports: [CommonModule, RouterModule.forChild(profileRoute), SharedModule, ImageCropperModule, MaterialModule],
    exports: [RouterModule],
})
export class ProfileModule {}
