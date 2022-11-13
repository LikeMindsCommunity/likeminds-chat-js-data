import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'location-offline',
    templateUrl: './location-offline.component.html',
    styleUrls: ['./location-offline.component.scss'],
})
export class LocationOfflineComponent implements OnInit, OnChanges {
    @Input() default_value: string;
    @Input() clearInput: boolean;
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();
    @Output() geometry: EventEmitter<any> = new EventEmitter();
    @Output() resetClearInput: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl(null, Validators.required);
    constructor() {}

    ngOnInit() {
        this.control.setValue(String(this.default_value) || '');
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.clearInput?.currentValue) {
            this.control.setValue('');
            this.setFieldValue.emit('');
            this.geometry.emit({ lat: '', lng: '' });
            this.resetClearInput.emit();
        }
    }

    placeChangedCallback(event) {
        let formattedAddress = event && event.formatted_address;
        this.control.setValue(formattedAddress);
        const geometryObj = {
            lat: event.geometry.location.lat(),
            lng: event.geometry.location.lng(),
        };
        this.geometry.emit(geometryObj);
    }
}
