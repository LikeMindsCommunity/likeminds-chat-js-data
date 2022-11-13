import { Component, OnInit, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { EventDetailComponent } from '../../components/event-detail/event-detail.component';
import { EventsService } from 'src/app/core/services/events.service';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { googleCalendarEventUrl } from 'google-calendar-url';
import * as moment from 'moment';

@Component({
    selector: 'attend-event-sheet',
    templateUrl: './attend-event-sheet.component.html'
})

export class AttendEventSheetComponent implements OnInit {

    choice = false;
    isLoading = false;

    constructor(public sheetRef: MatBottomSheetRef<EventDetailComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
            chatroom: IChatroom
        },
        private eventService: EventsService) { }

    ngOnInit() {
        this.choice = this.data.chatroom.attending_status;
    }

    attendEvent() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.eventService.attendEvent(this.data.chatroom.id, this.choice).subscribe(response => {
            this.isLoading = false;
            this.close({ value: true, attending: this.choice });
        }, error => this.isLoading = false);
    }

    addToCalendar() {
        const { date_time, duration, title, about, online_link, location, attending_status } = this.data.chatroom;
        if (!attending_status) return;
        const url = googleCalendarEventUrl({
            start: moment(date_time).format('YYYYMMDDThhmmssz'),
            end: moment(date_time + duration).format('YYYYMMDDThhmmssz'),
            details: `${about} ${online_link ? `Link to join event online: ${online_link}` : ''}`,
            title,
            location
        });

        window.open(url, 'blank');
    }

    close({value, attending}) {
        this.sheetRef.dismiss({ value, attending });
    }
}