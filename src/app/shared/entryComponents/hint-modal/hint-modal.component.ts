import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-hint-modal',
    templateUrl: './hint-modal.component.html',
    styleUrls: ['./hint-modal.component.scss']
})

export class HintModalComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<any>) { }

    ngOnInit() {

    }

    close() {
        this.dialogRef.close();
    }
}