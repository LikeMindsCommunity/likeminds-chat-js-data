import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'date-input',
    templateUrl: './date-input.component.html',
})
export class DateInputComponent implements OnInit, OnChanges {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    format: string;
    isDatepickerOpen = false;
    bsConfig: BsDatepickerConfig | any = {
        containerClass: 'date-input-class',
        showWeekNumbers: false,
        // maxDate: new Date() // Set min date for date picker
    };
    constructor() {}

    ngOnInit() {
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(moment(value).format(this.format));
            this.setFieldValidity.emit(this.control.valid);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question && changes.question.currentValue) {
            this.format = (this.question.options && this.question.options.date_time) || 'D/M/YYYY';
            this.format = String(this.format).toLocaleUpperCase();
            this.setCalenderMode(this.format);
            this.bsConfig = { ...this.bsConfig, dateInputFormat: this.format };
        }
    }

    setCalenderMode(format: string) {
        if (format.includes('D') || format.includes('DD') || format.includes('d') || format.includes('dd'))
            this.bsConfig = { ...this.bsConfig, minMode: 'day' };
        else if (format.includes('MM') || format.includes('MM') || format.includes('m') || format.includes('mm'))
            this.bsConfig = { ...this.bsConfig, minMode: 'month' };
        else if (format.includes('YYYY') || format.includes('yyyy')) this.bsConfig = { ...this.bsConfig, minMode: 'year' };
    }
}
