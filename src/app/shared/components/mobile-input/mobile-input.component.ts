import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { FormControl } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'mobile-input',
    templateUrl: './mobile-input.component.html'
})

export class MobileInputComponent implements OnInit, OnChanges {

    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl(null);
    inputType: string = 'tel';

    constructor() { }

    ngOnInit() {
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question && changes.question.currentValue) {
            if (this.question && this.question.options && this.question.options.answer_privacy === 'Private') this.inputType = 'password';
        }
    }
}