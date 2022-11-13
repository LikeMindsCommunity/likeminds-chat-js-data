import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ChoiceDialogData} from '../../models/choice.model';

@Component({
  selector: 'app-choice-sheet',
  templateUrl: './choice-sheet.component.html',
  styleUrls: ['./choice-sheet.component.scss']
})
export class ChoiceSheetComponent implements OnInit {

  constructor(
    public sheetRef: MatBottomSheetRef<ChoiceSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ChoiceDialogData
  ) { }

  ngOnInit(): void {
  }

}
