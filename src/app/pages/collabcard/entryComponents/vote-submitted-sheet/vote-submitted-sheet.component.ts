import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';

@Component({
  selector: 'app-vote-submitted-sheet',
  templateUrl: './vote-submitted-sheet.component.html'
})
export class VoteSubmittedSheetComponent implements OnInit {

  endDate: string;

  constructor(public sheetRef: MatBottomSheetRef<PollCardComponent>,
      @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
        endDate: string;
      },
    ) { }

  ngOnInit(): void {
    this.endDate = this.data.endDate;
  }

  closeSheet() {
    this.sheetRef.dismiss();
  }
}
