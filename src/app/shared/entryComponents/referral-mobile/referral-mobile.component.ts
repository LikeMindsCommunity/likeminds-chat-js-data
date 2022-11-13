import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-referral-mobile',
  templateUrl: './referral-mobile.component.html',
  styleUrls: ['./referral-mobile.component.scss']
})
export class ReferralMobileComponent implements OnInit {

  screenType : string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public plansMobile: any,
    private utilsService : UtilsService
  ) { }

  ngOnInit(): void {
    this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
  }

  openShareUrl(){
    this.utilsService.closeMatBottomSheet$$.next(true);
  }

}
