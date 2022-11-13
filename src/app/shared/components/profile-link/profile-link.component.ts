import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IQuestion } from 'src/app/shared/models/question.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { facebookLinkValidators, linkedinLinkValidators, profileUrlValidator, usernameValidator } from 'src/app/shared/utils';

@Component({
    selector: 'profile-link',
    styles: [
        `
            span {
                margin-right: 8px;
                color: rgba(0, 0, 0, 0.24);
            }
        `,
    ],
    templateUrl: './profile-link.component.html',
})
export class ProfileLinkComponent implements OnInit {
    @Input() question: IQuestion;
    @Input() formSubmitted: boolean;

    @Output() setFieldValidity: EventEmitter<any> = new EventEmitter();
    @Output() setFieldValue: EventEmitter<any> = new EventEmitter();

    readonly SOCIAL_SITES = {
        Instagram: 'Instagram',
        Twitter: 'Twitter',
        Facebook: 'Facebook',
        Linkedin: 'Linkedin',
    };
    isTwitterOrInstagramProfile = false;

    control: FormControl = new FormControl(null);

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        const profilePlatform = this.question.options.profile_platform;
        this.isTwitterOrInstagramProfile =
            profilePlatform.toLowerCase() === this.SOCIAL_SITES.Instagram.toLowerCase() ||
            profilePlatform.toLowerCase() === this.SOCIAL_SITES.Twitter.toLowerCase();
        switch (profilePlatform.toLowerCase()) {
            case this.SOCIAL_SITES.Instagram.toLowerCase():
            case this.SOCIAL_SITES.Twitter.toLowerCase():
                this.control.setValidators([usernameValidator]);
                break;
            case this.SOCIAL_SITES.Facebook.toLowerCase():
                this.control.setValidators([profileUrlValidator, facebookLinkValidators]);
                break;
            case this.SOCIAL_SITES.Linkedin.toLowerCase():
                this.control.setValidators([profileUrlValidator, linkedinLinkValidators]);
                break;
            default:
                this.control.setValidators([profileUrlValidator]);
                break;
        }
        this.control.updateValueAndValidity();

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
