import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-poll-chatroom-rename-popup',
  templateUrl: './poll-chatroom-rename-popup.component.html',
  styleUrls: ['./poll-chatroom-rename-popup.component.scss']
})
export class PollChatroomRenamePopupComponent implements OnInit {

  chatRoomName = '';

  constructor(
    private dialogRef: MatDialogRef<any>,
  ) { }

  ngOnInit(): void {
  }

  updateChatroomName(){ 
    if(!this.chatRoomName) return;
    this.dialogRef.close(this.chatRoomName);
  }

}
