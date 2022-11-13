import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-available-only-on-app',
  templateUrl: './available-only-on-app.component.html',
  styleUrls: ['./available-only-on-app.component.scss']
})
export class AvailableOnlyOnAppComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
