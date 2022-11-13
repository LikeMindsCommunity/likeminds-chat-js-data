import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
    name: 'formatTime'
})

export class FormatTimePipe implements PipeTransform {
    transform(value: any, arg?: string) {
        if (!value) return value;

        // return moment.utc(value).local().format('hh:mm:ss');
        let n = value;

        let day = n; // (24 * 3600)

        n = n % (24 * 3600);
        let hour = n; // 3600

        n %= 3600;
        let minutes = n; // 60

        n %= 60;
        let seconds = n;
        let time_text = '';

        if (day != 0) time_text = `${day} ${day == 1 ? 'day' : 'days'}`;
        if (hour != 0) time_text = `${time_text} ${hour} ${hour == 1 ? 'hour' : 'hours'}`;
        if (minutes != 0) time_text = `${time_text} and ${minutes} ${minutes == 1 ? 'minute' : 'minutes'}`;

        if (hour == 0 && minutes != 0) time_text = `${minutes} ${minutes == 1 ? 'minute' : 'minutes'}`;

        if (hour == 0 && minutes == 0) time_text = seconds + ' seconds';

        return time_text;
    }
}