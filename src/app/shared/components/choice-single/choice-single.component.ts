import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'choice-single',
    templateUrl: './choice-single.component.html',
})
export class ChoiceSingleComponent implements OnInit, OnChanges {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    hasOtherOption: boolean;
    showAddNewOption: boolean = false;
    selectedValue: string;
    constructor() {}

    ngOnInit() {
        this.emitData(this.question.value);

        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (String(value).trim()) {
                const filteredResult = this.question.options.filter(
                    (option) => option.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
                );
                if (filteredResult.length > 0) this.showAddNewOption = false;
                else this.showAddNewOption = true;
            }
            this.emitData(value);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question && changes.question.currentValue) {
            this.hasOtherOption = this.question.options.find((option) => String(option.value).toLocaleLowerCase() === 'other')
                ? true
                : false;
            if (this.hasOtherOption)
                this.question.options = this.question.options
                    .filter((option) => String(option.value).toLocaleLowerCase() !== 'other')
                    .sort((a, b) => {
                        if (String(a.value).toLocaleLowerCase() < String(b.value).toLocaleLowerCase()) return -1;
                        if (String(a.value).toLocaleLowerCase() > String(b.value).toLocaleLowerCase()) return 1;
                        return 0;
                    });
        }
    }

    selected(event): void {
        this.showAddNewOption = false;
        this.selectedValue = event.option.value;
        this.control.setValue(event.option.value);
        this.emitData(event.option.value);
    }

    clearField(event) {
        let timer = setTimeout(() => {
            if (!this.selectedValue) this.control.setValue(null);
            clearTimeout(timer);
        }, 0);
    }

    emitData(value) {
        this.setFieldValue.emit(value);
        this.setFieldValidity.emit(this.control.valid);
    }
}
