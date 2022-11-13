import {Component, Input} from '@angular/core';
import {BaseHeaderData} from '../../../../models/header.model';
import {DEFAULT_PROFILE_PHOTO_LINK} from '../../../../constants/api.constant';

@Component({
    selector: 'app-chatroom-image',
    templateUrl: './chatroom-image.component.html',
    styleUrls: ['./chatroom-image.component.scss']
})

export class ChatroomImage {
    @Input() data: BaseHeaderData;
    constructor() { }
    
    setDefaultPic(evt): void {
      evt.target.src = DEFAULT_PROFILE_PHOTO_LINK
    }

}
