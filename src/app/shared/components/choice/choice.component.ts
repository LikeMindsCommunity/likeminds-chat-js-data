import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChoiceDialogData} from '../../models/choice.model';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  @Input() data: ChoiceDialogData;
  @Output() output = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
