import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
    transform(value: any, arg?: string) {
        if (!value) return value;
        switch (arg) {
            case 'MMM DD YYYY':
            case 'MMM YYYY':
            case 'MMMM DD YYYY':
            case 'DD MMM YYYY':
            case 'DD MMMM YYYY':
            case 'DD MMMM, YYYY':
            case 'DD MMMM':
            case 'D/MM/YY':
            case 'DD/MM/YY':
            case 'MMM DD':
            case 'DD':
            case 'MMM':
            case 'dddd':
            case 'dddd, MMM DD, h:mm':
            case 'dddd, MMM DD, HH:mm':
            case 'h:mm':
            case 'MMM, DD':
            case 'E':
            case 'h:mm a':
                return moment(value).format(arg);
            case 'dd MMM YYYY':
                return moment(value).format('DD MMM YYYY');
            default:
                return moment.unix(value).format(arg);
        }
    }
}
