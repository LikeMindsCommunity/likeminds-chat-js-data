import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICommunity } from '../../models/community.model';
import { IMember, IMemberState } from '../../models/member.model';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'join-community-popup',
  templateUrl: './join-community-popup.component.html'
})
export class JoinCommunityPopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: {
      memberState: IMemberState,
      user: IUser,
      community: ICommunity,
      admins: IMember[],
    }
  ) { }

  ngOnInit(): void {
  }

  close(event) {
    this.dialogRef.close(event);
  }

}
