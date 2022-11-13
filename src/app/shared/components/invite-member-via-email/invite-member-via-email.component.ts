import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { CommunityService } from 'src/app/core/services/community.service';
import { checkIfEmailIsCorrect, readFileContent } from '../../utils';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { INVITE_FLOW } from '../../enums/mixpanel.enum';
@Component({
    selector: 'app-invite-member-via-email',
    templateUrl: './invite-member-via-email.component.html',
    styleUrls: ['./invite-member-via-email.component.scss'],
})
export class InviteMemberViaEmailComponent implements OnInit {
    @Input() inivte_link_type: string;
    @Input() communityId: string;
    @Input() communityName: string;
    @Output() inviteSendComplete: EventEmitter<any> = new EventEmitter();

    maxEmailCount = 100;
    inivte_link_type_free = 'free';
    inivte_link_type_paid = 'paid';
    separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    emailCtrl = new FormControl();
    emailList: string[] = [];
    errorInEmailList: boolean = false;
    placeHolder: string = 'Add upto 100 emails here seperated by commas.';
    invitationForm;
    private destroy$$ = new Subject();
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
    constructor(
        private formBuilder: FormBuilder,
        private communityService: CommunityService,
        private snackbar: MatSnackBar,
        private store: Store<State>,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {
        this.invitationForm = this.formBuilder.group({
            emailString: '',
            invitationText: `Hello! \n\nI’d like to invite you to our community, ${this.communityName}. \n\nIt takes less than a minute to join and together we’re sharing our stories, experiences, and ideas. \n\nI know you’ll love it. \n\nSee you here!`,
        });
    }

    onChipClick(event) {
        event.stopPropagation();
    }
    setFoucusOnInput() {
        this.emailInput.nativeElement.focus();
    }

    captureAnalytics() {
        if (this.inivte_link_type == this.inivte_link_type_free) {
            this.analyticsService.sendEvent(INVITE_FLOW.FREE_MEMBER_INVITED, {
                type: 'via_email',
            });
        } else if (this.inivte_link_type == this.inivte_link_type_paid) {
            this.analyticsService.sendEvent(INVITE_FLOW.PAID_MEMBER_INVITED, {
                type: 'via_email',
            });
        }
    }

    addInEmailList(val) {
        const value = (val || '').trim();

        // Add our fruit
        if (value) {
            this.emailList.push(value);
            this.placeHolder = '';
        }

        // Clear the input value
        // if (event.input) {
        //   event.input.value = '';
        //  }

        this.emailCtrl.setValue(null);
        this.isEmailListErrorFree();
    }
    checkDataAndSendInvite() {
        if (this.emailCtrl.value) {
            this.addInEmailList(this.emailCtrl.value);
        }
        this.onSend();
    }

    onSend() {
        this.store.dispatch(StartLoading());
        if (this.emailList.length <= 0) {
            this.store.dispatch(StopLoading());
            this.snackbar.open('Please provide atleast 1 EmailId to send invite to', undefined, {
                duration: 5000,
                panelClass: ['snackbar-error'],
            });
            return;
        }
        if (!this.invitationForm.value.invitationText) {
            this.store.dispatch(StopLoading());
            this.snackbar.open('Please provide Invitation Text to proceed', undefined, {
                duration: 5000,
                panelClass: ['snackbar-error'],
            });
            return;
        }
        if (this.emailList.length > this.maxEmailCount) {
            this.store.dispatch(StopLoading());
            this.snackbar.open(
                `More than ${this.maxEmailCount} EmailId's are added.Please remove ${
                    this.emailList.length - this.maxEmailCount
                } EmailId to proceed.`,
                undefined,
                {
                    duration: 5000,
                    panelClass: ['snackbar-error'],
                }
            );
            return;
        }
        if (this.errorInEmailList) {
            this.store.dispatch(StopLoading());
            this.snackbar.open('One or more EmailId provided are incorrect.Please provide correct EmailId.', undefined, {
                duration: 5000,
                panelClass: ['snackbar-error'],
            });
            return;
        }

        const body = {
            type: 'email',
            email_id: this.emailList.join(','),
            mobile_no: '',
            text: this.invitationForm.value.invitationText,
            link_type: this.inivte_link_type,
            community_id: this.communityId,
        };
        this.communityService
            .sendInviteLinks(body)
            .pipe(takeUntil(this.destroy$$))
            .subscribe(
                (res) => {
                    if (!res?.success) {
                        this.store.dispatch(StopLoading());
                        this.snackbar.open(res?.error_message, undefined, {
                            duration: 5000,
                            panelClass: ['snackbar-error'],
                        });
                        return;
                    }
                    this.inviteSendComplete.emit();
                    this.store.dispatch(StopLoading());
                    this.captureAnalytics();
                    this.snackbar.open('Invitations sent successfully', undefined, {
                        duration: 5000,
                        panelClass: ['snackbar'],
                    });
                },
                (err) => {
                    this.store.dispatch(StopLoading());
                    this.snackbar.open(err?.error?.error_message, undefined, {
                        duration: 5000,
                        panelClass: ['snackbar-error'],
                    });
                }
            );
    }
    downloadSampleEmailCsvFile() {
        let link = document.createElement('a');
        link.download = 'InviteViaEmailSample.csv';
        link.href = 'https://web.likeminds.community/assets/sampleCsv/InviteViaEmailSample.csv';
        link.click();
    }

    processCsv(content) {
        this.store.dispatch(StartLoading());
        let contentArray = content.split('\n');
        if (contentArray.length == 0 || contentArray.length <= 1) {
            this.snackbar.open('No data found in CSV while parsing.', undefined, {
                duration: 5000,
                panelClass: ['snackbar'],
            });
            return;
        }

        contentArray.shift();
        if (contentArray[contentArray.length - 1] == '') {
            contentArray.pop();
        }

        this.emailList = contentArray.slice();
        if (this.emailList.length > 0) {
            this.placeHolder = '';
        }
        this.isEmailListErrorFree();
        this.store.dispatch(StopLoading());
    }

    convertFile(event: any) {
        const file = event.target.files[0];

        readFileContent(file)
            .then((content) => {
                // Operate your string as required in a separate function
                this.processCsv(content);
                this.emailInput.nativeElement.value = '';
            })
            .catch((error) => console.log(error));
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            this.emailList.push(value);
            this.placeHolder = '';
        }

        // Clear the input value
        if (event.input) {
            event.input.value = '';
        }

        this.emailCtrl.setValue(null);
        this.isEmailListErrorFree();
    }

    remove(fruit: string): void {
        const index = this.emailList.indexOf(fruit);

        if (index >= 0) {
            this.emailList.splice(index, 1);
        }
        if (this.emailList.length <= 0) {
            this.placeHolder = 'Add upto 100 emails here seperated by commas.';
        }
        this.isEmailListErrorFree();
    }

    setError() {
        // this.chipList?.errorState = true;
    }

    checkIfEmailIsCorrectorNot(email) {
        return checkIfEmailIsCorrect(email);
    }

    isEmailListErrorFree(): void {
        if (this.emailList.length > 0) {
            this.emailList.every((email) => {
                if (!this.checkIfEmailIsCorrectorNot(email)) {
                    this.errorInEmailList = true;
                    return false;
                } else {
                    this.errorInEmailList = false;
                    return true;
                }
            });
        } else {
            this.errorInEmailList = false;
        }
    }
}
