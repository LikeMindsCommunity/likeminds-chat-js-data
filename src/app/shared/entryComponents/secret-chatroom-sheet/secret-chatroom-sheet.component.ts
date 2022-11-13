import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-secret-chatroom-sheet',
    templateUrl: './secret-chatroom-sheet.component.html',
    styleUrls: ['./secret-chatroom-sheet.component.scss'],
})
export class SecretChatroomSheetComponent implements OnInit {
    crType: any;
    constructor(
        private bottomSheetRef: MatBottomSheetRef<any>,
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: {
            title: any;
        }
    ) {}

    ngOnInit() {
        this.crType = this.data.title;
    }

    close() {
        this.bottomSheetRef.dismiss();
    }

    /*########### Template Driven Form ###########*/
    templateForm(value: any) {
        this.bottomSheetRef.dismiss({ action: value.crType });
    }
}
