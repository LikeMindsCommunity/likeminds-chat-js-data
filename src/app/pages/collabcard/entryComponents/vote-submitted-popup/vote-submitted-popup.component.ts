import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';

@Component({
  selector: 'app-vote-submitted-popup',
  templateUrl: './vote-submitted-popup.component.html'
})
export class VoteSubmittedPopupComponent implements OnInit {

  endDate: string;

  constructor(public dialogRef:MatDialogRef<PollCardComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {
        endDate: string
      },
    ) { }

  ngOnInit(): void {
    this.endDate = this.data.endDate;
  }

  closePopup() {
    this.dialogRef.close();
  }

}
