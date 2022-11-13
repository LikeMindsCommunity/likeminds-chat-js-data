import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'choice-multiple',
    templateUrl: './choice-multiple.component.html',
})
export class ChoiceMultipleComponent implements OnInit, OnChanges {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    selectedOptions = [];
    options = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filteredOptions: Observable<any[]>;
    hasOtherOption: boolean;

    @ViewChild('choiceInput') choiceInput: ElementRef;

    constructor() {}

    ngOnInit() {
        this.setOptions();
        this.filteredOptions = this.control.valueChanges.pipe(
            startWith(null),
            map((option: any) => this.filter(option))
        );
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => this.emitData(value));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.question && changes?.question?.currentValue) {
            this.setOptions();
            this.hasOtherOption = this.question?.options?.find((option) => String(option?.value).toLocaleLowerCase() === 'other')
                ? true
                : false;
            if (this.hasOtherOption) {
                this.question.options = this.question?.options.filter((option) => String(option?.value).toLocaleLowerCase() !== 'other');
            }
        }
    }

    setOptions(): void {
        if(this.question?.options){
            this.options = [
                ...this.question?.options?.sort((a, b) => {
                    if (String(a.value).toLocaleLowerCase() < String(b.value).toLocaleLowerCase()) {
                        return -1;
                    }
                    if (String(a.value).toLocaleLowerCase() > String(b.value).toLocaleLowerCase()) {
                        return 1;
                    }
                    return 0;
                }),
            ];
        }
        else this.options = [];
    }

    filter(name: string): any[] {
        if (!name) {
            return this.options;
        }
        return this.options.filter((option) =>
            !this.selectedOptions.includes(option.value)
                ? option.value && String(option.value).toLowerCase().trim().indexOf(String(name).toLowerCase()) > -1
                : false
        );
    }

    add(event: MatChipInputEvent): void {
        if (!this.hasOtherOption) {
            return;
        }
        const input = event.input;
        const value = event.value;

        // Add our option
        if ((value || '').trim()) {
            this.selectedOptions.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.control.setValue(null);
    }

    remove(fruit: any): void {
        const index = this.selectedOptions.indexOf(fruit);

        if (index >= 0) {
            this.selectedOptions.splice(index, 1);
        }
        this.control.setValue(' ');
        this.control.setValue(null);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedOptions.push(event.option.viewValue);
        this.choiceInput.nativeElement.value = '';
        this.control.setValue(null);
    }

    emitData(values: any[]) {
        const data = this.selectedOptions.join('$#');
        this.setFieldValue.emit(data);
        this.setFieldValidity.emit(this.selectedOptions && this.selectedOptions.length ? true : false);
    }
}
