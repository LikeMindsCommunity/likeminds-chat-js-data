import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-poll-option',
  templateUrl: './add-poll-option.component.html',
  styleUrls: ['./add-poll-option.component.scss']
})
export class AddPollOptionComponent implements OnInit {

  option: string = "";
  @Input() isSheet: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  submitOption(option: string) {
    if (option.length) {
      this.submit.emit(option);
    }
  }

}
