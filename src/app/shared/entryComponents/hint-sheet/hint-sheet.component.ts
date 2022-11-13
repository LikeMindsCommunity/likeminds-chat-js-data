import { Component } from "@angular/core";
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-hint-sheet',
    templateUrl: './hint-sheet.component.html',
    styleUrls: ['./hint-sheet.component.scss']
})

export class HintSheetComponent {

    constructor(private bottomSheetRef: MatBottomSheetRef<any>) { }

    close() {
        this.bottomSheetRef.dismiss();
    }
}