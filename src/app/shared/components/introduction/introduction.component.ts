import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ResizeService } from 'src/app/core/services/resize.service';
import { HintModalComponent } from 'src/app/shared/entryComponents/hint-modal/hint-modal.component';
import { HintSheetComponent } from 'src/app/shared/entryComponents/hint-sheet/hint-sheet.component';

export class IntroTooltip {
    message: string;
    className: string;
    display: boolean;
}

@Component({
    selector: 'introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit, OnChanges, AfterViewInit {
    tooltip: IntroTooltip = new IntroTooltip();

    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;
    @Input() branding: any;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    progress = 0;
    isProgressMax = false;
    outerStroke: string = '#06c3af';
    innerStroke: string = 'rgba(6, 195, 175, 0.16)';
    hintOpen: boolean;
    screenType: string;
    dialogRef: MatDialogRef<any>;
    sheetRef: MatBottomSheetRef;
    isHintDialogOpen = false;
    isHintSheetOpen = false;
    constructor(
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private cdr: ChangeDetectorRef,
        private resizeService: ResizeService
    ) {}

    ngOnInit() {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.resizeService.onResize$.subscribe((size) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
            if (this.screenType === 'mobile' && this.isHintDialogOpen) {
                this.isHintDialogOpen = false;
                this.dialogRef.close();
                this.openHintBottomSheet();
            } else if (['tab', 'desktop'].includes(this.screenType) && this.isHintSheetOpen) {
                this.isHintSheetOpen = false;
                this.sheetRef.dismiss();
                this.openHint();
            }
        });
        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
            this.setFieldValidity.emit(this.control.valid);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question && changes.question.currentValue) {
            let validations = this.question.options;
            if (validations && parseInt(validations.min_chars)) {
                this.control.setValidators([Validators.required, Validators.minLength(parseInt(validations.min_chars))]);
            }

            if (validations && parseInt(validations.max_chars)) {
                this.control.setValidators([Validators.required, Validators.minLength(parseInt(validations.max_chars))]);
            }

            if (validations && parseInt(validations.min_chars) && parseInt(validations.max_chars)) {
                this.control.setValidators([
                    Validators.required,
                    Validators.minLength(parseInt(validations.min_chars)),
                    Validators.maxLength(parseInt(validations.max_chars)),
                ]);
            }
            this.control.updateValueAndValidity();
        }
    }

    ngAfterViewInit() {
        const {
            options: { min_chars, max_chars },
        } = this.question;
        this.tooltip.className = 'success';
        this.tooltip.message = `Minimum characters: ${parseInt(min_chars)}`;
        this.tooltip.display = true;
        this.cdr.detectChanges();
    }

    textareaInput(event, min, max) {
        const MIN = Number(min);
        const MAX = Number(max);
        const valueLength = String(event && event.target.value).trim().length;
        if (valueLength < MIN && this.isProgressMax) {
            this.outerStroke = '#d0021b';
            this.innerStroke = '#e0b3b7';
            this.tooltip.className = 'error';
            this.tooltip.message = `Minimum characters: ${MIN - valueLength}`;
            this.progress = (valueLength / MIN) * 100;
            this.tooltip.display = true;
            return;
        }
        if (MIN && valueLength < MIN) {
            this.progress = (valueLength / MIN) * 100;
            this.tooltip.display = false;
        } else if (MAX && valueLength > MAX) {
            this.progress = 100;
            this.outerStroke = '#d0021b';
            this.innerStroke = '#e0b3b7';
            this.tooltip.className = 'error';
            this.tooltip.message = `Maximum characters: ${MAX}`;
            this.tooltip.display = true;
        } else {
            this.outerStroke = '#06c3af';
            this.innerStroke = 'rgba(6, 195, 175, 0.16)';
            this.progress = (valueLength / MIN) * 100;
            this.tooltip.display = false;
            if (this.progress >= 100) this.isProgressMax = true;
        }
    }

    openHint() {
        this.isHintDialogOpen = true;
        this.dialogRef = this.dialog.open(HintModalComponent, {
            panelClass: 'hint-modal',
            disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe();
    }

    openHintBottomSheet() {
        this.isHintSheetOpen = true;
        this.sheetRef = this.bottomSheet.open(HintSheetComponent);
        this.sheetRef.afterDismissed().subscribe();
    }
}
