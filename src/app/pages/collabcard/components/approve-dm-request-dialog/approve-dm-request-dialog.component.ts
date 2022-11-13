import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DmService } from 'src/app/core/services/dm.services';

@Component({
  selector: 'app-approve-dm-request-dialog',
  templateUrl: './approve-dm-request-dialog.component.html',
  styleUrls: ['./approve-dm-request-dialog.component.scss']
})
export class ApproveDmRequestDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ApproveDmRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dmService: DmService) { }

  ngOnInit(): void {
  }

  accept() {
    this.dmService.requestDM({ chatroom_id: this.data.chatroom_id, chat_request_state: 1 }).toPromise().then(res => {
      if (res?.success)
        this.dialogRef.close('accept')
      else
        this.dialogRef.close()
    }, err => {
      this.dialogRef.close()

    })
  }
}
