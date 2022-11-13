import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-add-membership-plan-dialog',
  templateUrl: './add-membership-plan-dialog.component.html',
  styleUrls: ['./add-membership-plan-dialog.component.scss']
})
export class AddMembershipPlanDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      createMembershipUrl: string,
      
  }
  ) { }

  ngOnInit(): void {
  }

  startMembershipPlanCreationFlow(){
    window.open(this.data?.createMembershipUrl);
  }

}
