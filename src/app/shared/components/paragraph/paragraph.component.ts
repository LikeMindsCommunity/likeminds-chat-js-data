import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'paragraph',
    templateUrl: './paragraph.component.html',
})
export class ParagraphComponent implements OnInit {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl(null);

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.setFieldValue.emit(this.question.value);
        this.setFieldValidity.emit(this.control.valid);

        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
            this.setFieldValidity.emit(this.control.valid);
        });
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
}
