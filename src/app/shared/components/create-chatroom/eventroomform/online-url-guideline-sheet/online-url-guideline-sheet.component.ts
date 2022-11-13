import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-online-url-guideline-sheet',
  templateUrl: './online-url-guideline-sheet.component.html',
  styleUrls: ['./online-url-guideline-sheet.component.scss']
})
export class OnlineUrlGuidelineSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<any>
  ) { }

  ngOnInit(): void {
  }

  close() { 
    this.bottomSheetRef.dismiss();  
  }

}
