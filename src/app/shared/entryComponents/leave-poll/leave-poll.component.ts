import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-poll',
  templateUrl: './leave-poll.component.html',
  styleUrls: ['./leave-poll.component.scss']
})
export class LeavePollComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: {
      communityId: number,
    },
    ) { }

  ngOnInit(): void {
  }

  leave() {
    this.dialogRef.close(true);
  }

  stay() {
      this.dialogRef.close(false);
  }

}
