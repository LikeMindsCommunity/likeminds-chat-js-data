import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-banner-guideline-popup',
  templateUrl: './banner-guideline-popup.component.html',
  styleUrls: ['./banner-guideline-popup.component.scss']
})
export class BannerGuidelinePopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
  }

  close() { 
    this.dialogRef.close();
  }

}
