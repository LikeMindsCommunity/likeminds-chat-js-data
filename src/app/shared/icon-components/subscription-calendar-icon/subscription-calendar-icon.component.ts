import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription-calendar-icon',
  templateUrl: './subscription-calendar-icon.component.html',
  styleUrls: ['./subscription-calendar-icon.component.scss']
})
export class SubscriptionCalendarIconComponent implements OnInit {
  @Input() inactive;

  constructor() { }

  ngOnInit(): void {
  }

}
