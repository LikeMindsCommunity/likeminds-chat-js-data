import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-community-expired-overlay',
  templateUrl: './community-expired-overlay.component.html',
  styleUrls: ['./community-expired-overlay.component.scss']
})
export class CommunityExpiredOverlayComponent implements OnInit {

    screenType : string;
    @Input() communityName;

    constructor() { }

    ngOnInit() {
      this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
    }
}
