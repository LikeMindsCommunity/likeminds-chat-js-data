import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-banner-guideline-sheet',
  templateUrl: './banner-guideline-sheet.component.html',
  styleUrls: ['./banner-guideline-sheet.component.scss']
})
export class BannerGuidelineSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<any>
  ) { }

  ngOnInit(): void {
  }

  close() { 
    this.bottomSheetRef.dismiss();  
  }

}
