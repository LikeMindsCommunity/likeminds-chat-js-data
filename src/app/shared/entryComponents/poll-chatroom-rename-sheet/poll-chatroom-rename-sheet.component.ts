import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-poll-chatroom-rename-sheet',
  templateUrl: './poll-chatroom-rename-sheet.component.html',
  styleUrls: ['./poll-chatroom-rename-sheet.component.scss']
})
export class PollChatroomRenameSheetComponent implements OnInit {

  chatRoomName = '';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<any>
  ) { }

  ngOnInit(): void {
  }

  updateChatroomName(){ 
    if(!this.chatRoomName) return;
    this.bottomSheetRef.dismiss(this.chatRoomName);
  }


}
