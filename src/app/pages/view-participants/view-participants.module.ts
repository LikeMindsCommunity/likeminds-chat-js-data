import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ViewParticipantsComponent } from './page/view-participants/view-participants.component';
// import { ParticipantsComponent } from './components/participants/participants.component';
import { RouterModule, Routes } from '@angular/router';
import { ROOT_PATH } from 'src/app/shared/constants/routes.constant';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
// import { RemoveParticipantsDialogComponent } from './entryComponents/remove-participants-dialog/remove-participants-dialog.component';

const ViewParticipantsRoute: Routes = [
    {
        path: ROOT_PATH,
        // component: ViewParticipantsComponent,
    },
];

@NgModule({
    // declarations: [ParticipantsComponent, RemoveParticipantsDialogComponent],
    imports: [CommonModule, RouterModule.forChild(ViewParticipantsRoute), SharedModule, MaterialModule],
})
export class ViewParticipantsModule {}
