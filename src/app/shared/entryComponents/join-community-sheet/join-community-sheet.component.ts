import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ICommunity } from '../../models/community.model';
import { IMember, IMemberState } from '../../models/member.model';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'join-community-sheet',
  templateUrl: './join-community-sheet.component.html'
})
export class JoinCommunitySheetComponent implements OnInit {

  constructor(
    private sheetRef: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      memberState: IMemberState,
      user: IUser,
      community: ICommunity,
      admins: IMember[],
    }
  ) { }

  ngOnInit(): void {
  }

  close(event) {
    this.sheetRef.dismiss(event);
  }

}
