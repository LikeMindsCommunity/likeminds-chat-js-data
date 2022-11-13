import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { EventsService } from 'src/app/core/services/events.service';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { googleCalendarEventUrl } from 'google-calendar-url';
import * as moment from 'moment';
import {CHATROOM_TYPE_MAP} from '../../../../shared/constants/app-constant';
import {MIXPANEL} from '../../../../shared/enums/mixpanel.enum';

@Component({
    selector: 'attend-event',
    templateUrl: './attend-event.component.html',
    styleUrls: ['./attend-event.component.scss']
})

export class AttendEventComponent implements OnInit {

    @Output() close: EventEmitter<any> = new EventEmitter();
    @Input() chatroom: IChatroom;
    @Input() isSheet: boolean;

    choice = false;
    isLoading = false;

    constructor(private eventService: EventsService) { }

    ngOnInit() {
        this.choice = this.chatroom.attending_status;
    }

    attendEvent() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.eventService.attendEvent(this.chatroom.id, this.choice).subscribe(response => {
            this.isLoading = false;
            this.close.emit({ value: true, attending: this.choice });
        }, error => this.isLoading = false);
    }

    addToCalendar() {
        const { date_time, duration, title, about, online_link, location, attending_status } = this.chatroom;
        if (!attending_status && !this.choice) return;
        const url = googleCalendarEventUrl({
            start: moment(date_time).format('YYYYMMDDThhmmssz'),
            end: moment(date_time + duration).format('YYYYMMDDThhmmssz'),
            details: `${about} ${online_link ? `Link to join event online: ${online_link}` : ''}`,
            title,
            location
        });

        window.open(url, 'blank');
    }
}
