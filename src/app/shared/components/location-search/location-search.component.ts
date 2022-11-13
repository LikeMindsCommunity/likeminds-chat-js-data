import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'location-search',
    templateUrl: './location-search.component.html',
})
export class LocationSearchComponent implements OnInit, OnChanges {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    constructor() {}

    ngOnInit() {
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
            this.setFieldValidity.emit(this.control.valid);
        });
    }

    placeChangedCallback(event) {
        let formattedAddress = event && event.formatted_address;
        this.control.setValue(formattedAddress);
    }

    ngOnChanges() {}
}
