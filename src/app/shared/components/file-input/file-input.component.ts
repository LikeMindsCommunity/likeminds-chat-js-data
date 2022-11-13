import { Component, OnInit, OnChanges, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { IUser } from 'src/app/shared/models/user.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';

@Component({
    selector: 'file-input',
    templateUrl: './file-input.component.html',
})
export class FileInputComponent implements OnInit, OnChanges {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;
    @Input() communityId: number;
    @Input() user: IUser;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    control: FormControl = new FormControl();
    isLoading = false;
    file: File;
    progress = 0;
    imageUrl: string;
    validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    validFileSize = 16777216;
    invalidFileType: boolean;
    invalidFileSize: boolean;
    screenType: string;
    boxShadow: string;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private storage: AngularFireStorage,
        private snackBar: MatSnackBar,
        private resizeService: ResizeService
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
            this.boxShadow = this.screenType === 'mobile' ? '0 2px 4px 0 rgba(0, 0, 0, 0.19)' : null;
        }
        this.resizeService.onResize$.subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
            this.boxShadow = this.screenType === 'mobile' ? '0 2px 4px 0 rgba(0, 0, 0, 0.19)' : null;
        });

        this.control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
            if (!String(value).trim()) this.control.setValue(null);
            this.setFieldValue.emit(value);
            this.setFieldValidity.emit(this.control.valid);
        });
    }

    ngOnChanges() {}

    upload(questionId) {
        if (this.isLoading) return;
        if (this.imageUrl) {
            this.control.setValidators(Validators.required);
            this.control.setErrors({ required: true });
        }
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/gif, image/png, application/pdf';

        input.onchange = (e: any) => {
            let file: File = e.target.files[0];
            if (!this.validFileTypes.includes(file.type)) {
                this.showMessage('Only files with the following extensions are allowed: gif, png, jpeg & pdf');
                return;
            }
            if (file.size > this.validFileSize) {
                this.showMessage('This file exceeds the allowed limit of 16 MB');
                return;
            }
            this.file = file;
            this.progress = 0;
            const filePath = `files/community/${this.communityId}/question/${questionId}/${this.user.id}/${this.file.name}`;
            const task = this.storage.upload(filePath, this.file);
            task.snapshotChanges().subscribe((s) => {
                this.progress = (s.bytesTransferred / s.totalBytes) * 100;
                if (s.state === 'success')
                    s.ref.getDownloadURL().then((url) => {
                        this.imageUrl = url;
                        this.control.clearValidators();
                        this.control.setErrors(null);
                        this.setFieldValue.emit(url);
                        this.setFieldValidity.emit(this.control.valid);
                    });
            });
        };
        input.click();
    }

    showMessage(message: string) {
        let config = new MatSnackBarConfig();
        config.panelClass = ['snackbar'];
        config.duration = 5000;
        this.snackBar.open(message, undefined, config);
    }

    removeFile() {
        this.file = null;
        this.control.setValidators(Validators.required);
        this.control.setErrors({ required: true });
    }
}
