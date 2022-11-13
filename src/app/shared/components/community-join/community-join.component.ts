import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { IUser } from 'src/app/shared/models/user.model';


@Component({
  selector: 'app-community-join',
  templateUrl: './community-join.component.html',
  styleUrls: ['./community-join.component.scss']
})
export class CommunityJoinComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() chatroom: IChatroom;
  @Input() community: ICommunity;
  @Input() admins: IUser[];
  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
