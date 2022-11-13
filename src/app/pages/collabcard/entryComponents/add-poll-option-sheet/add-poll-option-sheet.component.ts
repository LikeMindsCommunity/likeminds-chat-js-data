import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-poll-option-sheet',
  templateUrl: './add-poll-option-sheet.component.html'
})
export class AddPollOptionSheetComponent implements OnInit {
  duplicateOptions: boolean = false;

  constructor(public sheetRef: MatBottomSheetRef<PollCardComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,
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
      "chatroom_id": this.data.chatroomId,
      "polls": [
        {
          "text": text
        }
      ]
    };
    this.chatroomService.addPoll(data)
      .subscribe(response => {
        this.closeSheet()
        this.snackbar.open('New Option Added', undefined, {
          panelClass: ['snackbar'],
          duration: 2000,
        });
      }, error => {
        // console.log("Error request");
      })
  }

  closeSheet() {
    this.sheetRef.dismiss();
  }

}
