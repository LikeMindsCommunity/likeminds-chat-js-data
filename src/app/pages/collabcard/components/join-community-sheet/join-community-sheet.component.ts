import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
    selector: 'app-join-community-sheet',
    templateUrl: './join-community-sheet.component.html',
    styleUrls: ['./join-community-sheet.component.scss']
})

export class JoinCommunitySheetComponent {
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Input() chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() admins: IUser[];
    @Input() message: string;

    constructor() { }
}