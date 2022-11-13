import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';

@Component({
  selector: 'app-member-reported-popup',
  templateUrl: './member-reported-popup.component.html',
  styleUrls: ['./member-reported-popup.component.scss']
})
export class MemberReportedPopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<any>,
    private hfService: HomeFeedService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
    // location.reload();
    this.hfService.refreshEvent.next(true);
  }

}
