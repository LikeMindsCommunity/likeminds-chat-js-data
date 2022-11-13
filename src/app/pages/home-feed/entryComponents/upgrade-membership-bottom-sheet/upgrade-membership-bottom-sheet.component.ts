import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgrade-membership-bottom-sheet',
  templateUrl: './upgrade-membership-bottom-sheet.component.html',
  styleUrls: ['./upgrade-membership-bottom-sheet.component.scss']
})
export class UpgradeMembershipBottomSheetComponent implements OnInit {
  mySubscription: any;
  screenType: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.mySubscription = data.mySubscription;
  }

  ngOnInit(): void {
    this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
  }

  route() {
    if (this.screenType === 'mobile') {
      this.router.navigate(['/renewal/' + this.mySubscription?.community?.id], { queryParams: { upgrade: true } });
    } else {
      this.router.navigate(['/community_feed/' + this.mySubscription?.community?.id + '/renewal/' + this.mySubscription?.community?.id], {
        queryParams: { upgrade: true },
      });
    }
  }

}
