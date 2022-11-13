import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PollOptionButtonComponent } from '../../components/poll-option-button/poll-option-button.component';

@Component({
  selector: 'app-anonymous-poll-sheet',
  templateUrl: './anonymous-poll-sheet.component.html',
  styleUrls: ['./anonymous-poll-sheet.component.scss']
})
export class AnonymousPollSheetComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PollOptionButtonComponent>) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
