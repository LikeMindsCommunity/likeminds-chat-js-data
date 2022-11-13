import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

  screenType : string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private plans: any,
    private utilsService : UtilsService
  ) { }

  ngOnInit(): void {
    this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
  }

  openShareUrl(){
    this.utilsService.closeMatDialogBox$$.next(true);
  }

}
