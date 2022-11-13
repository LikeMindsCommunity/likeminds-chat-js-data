import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-event-privacy-sheet',
  templateUrl: './event-privacy-sheet.component.html',
  styleUrls: ['./event-privacy-sheet.component.scss']
})
export class EventPrivacySheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<any>
    ) { }
  ngOnInit(): void {
  }

  close() { 
    this.bottomSheetRef.dismiss();  
  }

}
