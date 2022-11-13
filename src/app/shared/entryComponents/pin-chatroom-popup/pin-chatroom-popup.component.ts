import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';

@Component({
  selector: 'app-pin-chatroom-popup',
  templateUrl: './pin-chatroom-popup.component.html',
  styleUrls: ['./pin-chatroom-popup.component.scss']
})
export class PinChatroomPopupComponent implements OnInit {

  notifyAll: boolean = false;

  constructor(
    private homeFeedService: HomeFeedService,
    private snackbar: MatSnackBar,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: {
      chatroom_id: string,
      community_id: string
    }
  ) { }

  ngOnInit(): void {
  }

  toggleValue() {
    this.notifyAll = !this.notifyAll;
  }

  cancel() {
    this.dialog.close();
  }

  confirm() {
    this.homeFeedService.pinChatroom(this.data.chatroom_id, true, this.notifyAll).subscribe(response => {
      if (response.success) {
        this.homeFeedService.getCommunityDetail(this.data.community_id);
        this.homeFeedService.getChatroomDetail(this.data.chatroom_id, {});
        this.snackbar.open('Pinned successfully to community feed', null, {
        duration: 4000,
        panelClass: ['snackbar']
      });
      this.dialog.close();
    }
    });
  }

}
