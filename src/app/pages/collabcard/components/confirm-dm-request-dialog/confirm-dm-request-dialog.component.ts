import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dm-request-dialog',
  templateUrl: './confirm-dm-request-dialog.component.html',
  styleUrls: ['./confirm-dm-request-dialog.component.scss']
})
export class ConfirmDmRequestDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmDmRequestDialogComponent>) { }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close('confirm')
  }

}
