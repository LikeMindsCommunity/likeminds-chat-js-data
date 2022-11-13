import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { emailPattern } from 'src/app/shared/utils';

@Component({
    selector: 'email-input',
    templateUrl: './email-input.component.html',
})
export class EmailInputComponent implements OnInit {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl(null, [Validators.pattern(emailPattern())]);

    constructor() {}

    ngOnInit() {
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
            this.setFieldValidity.emit(this.control.valid);
        });
    }
}
