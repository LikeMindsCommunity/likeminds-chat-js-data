import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription-chats-icon',
  templateUrl: './subscription-chats-icon.component.html',
  styleUrls: ['./subscription-chats-icon.component.scss']
})
export class SubscriptionChatsIconComponent implements OnInit {

  @Input() inactive;

  constructor() { }

  ngOnInit(): void {
  }

}
