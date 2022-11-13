import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-block-dialog',
  templateUrl: './confirm-block-dialog.component.html',
  styleUrls: ['./confirm-block-dialog.component.scss']
})
export class ConfirmBlockDialogComponent implements OnInit {
  name:any;

  constructor(private dialogRef: MatDialogRef<ConfirmBlockDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = this.data.name;
   }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close('confirm')
  }

}
