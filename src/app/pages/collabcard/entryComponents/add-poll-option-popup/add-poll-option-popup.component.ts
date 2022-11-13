import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-poll-option-popup',
  templateUrl: './add-poll-option-popup.component.html',
})
export class AddPollOptionPopupComponent implements OnInit {

  optionText: string = "";
  duplicateOptions: boolean;

  constructor(public dialogRef: MatDialogRef<PollCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private chatroomService: ChatroomService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, undefined, {
      panelClass: ['snackbar'],
      duration: 2000,
    });
  }

  submitOption(text: string) {
    this.closePopup();
    let set;
    let allPollOptions = []
    for (let option of this.data.pollOptions) {
      allPollOptions.push(option.text);
    }
    allPollOptions.push(text);
    set = new Set(allPollOptions);
    if (set.size < allPollOptions.length) {
      this.openSnackBar("Can't add duplicate option");
      return;
    }

    let data: any = {
      "conversation_id": this.data?.conversation_id,
      "poll": {
        "text": text
      }
    };

    this.chatroomService.addMicroPoll(data)
      .subscribe(response => {
        this.snackbar.open('New Option Added', undefined, {
          panelClass: ['snackbar'],
          duration: 2000,
        });
      }, error => {
        //console.log("Error request");
      })
  }

  closePopup() {
    this.dialogRef.close();
  }

}
