import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ProfileComponent } from '../../pages/profile/profile.component';

@Component({
  selector: 'app-chatroom-options-sheet',
  templateUrl: './chatroom-options-sheet.component.html',
  styleUrls: ['./chatroom-options-sheet.component.scss']
})
export class ChatroomOptionsSheetComponent implements OnInit {

  constructor(
    private sheetRef: MatBottomSheetRef<ProfileComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      value: number,
      changeOptionfunction: any
    }
  ) { }

  ngOnInit(): void {
  }

  clickOption(value: number) {
    this.data.changeOptionfunction(value);
    this.sheetRef.dismiss();
  }

}
