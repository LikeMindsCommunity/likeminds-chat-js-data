import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-online-url-guideline-popup',
  templateUrl: './online-url-guideline-popup.component.html',
  styleUrls: ['./online-url-guideline-popup.component.scss']
})
export class OnlineUrlGuidelinePopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
  }

  close() { 
    this.dialogRef.close();
  }

}
