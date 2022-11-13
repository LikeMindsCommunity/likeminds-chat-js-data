import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IUser } from 'src/app/shared/models/user.model';

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss']
})

export class UpdateProfileComponent implements OnInit {

    @Output() close: EventEmitter<any> = new EventEmitter();
    @Output() update: EventEmitter<any> = new EventEmitter();
    @Input() user: IUser;
    constructor() { }

    ngOnInit() { }
}