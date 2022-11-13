import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-reported-popup',
  templateUrl: './reported-popup.component.html',
  styleUrls: ['./reported-popup.component.scss']
})
export class ReportedPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
        title: string,
        desc: string
    }
  ) { }

  ngOnInit(): void {
  }

}
