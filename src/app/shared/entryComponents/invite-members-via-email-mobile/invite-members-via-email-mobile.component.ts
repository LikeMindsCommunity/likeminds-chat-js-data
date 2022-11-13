import { Component, OnInit, Inject, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { CommunityService } from 'src/app/core/services/community.service';
import { checkIfEmailIsCorrect, readFileContent } from '../../utils';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { INVITE_FLOW } from '../../enums/mixpanel.enum';
@Component({
    selector: 'app-invite-members-via-email-mobile',
    templateUrl: './invite-members-via-email-mobile.component.html',
    styleUrls: ['./invite-members-via-email-mobile.component.scss'],
})
export class InviteMembersViaEmailMobileComponent implements OnInit {
    invitationForm = this.formBuilder.group({
        emailString: '',
        invitationText: '',
    });
    maxEmailCount = 100;
    inivte_link_type_free = 'free';
    inivte_link_type_paid = 'paid';
    separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    emailCtrl = new FormControl();
    emailList: string[] = [];
    errorInEmailList: boolean = false;
    placeHolder = 'Add upto 100 emails here seperated by commas.';
    private destroy$$ = new Subject();
    branding: any;
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: {
            closeBottomSheet: () => void;
            sheetRef;
            inivte_link_type;
            communityId;
            communityName;
        },

        private sheet: MatBottomSheetRef<InviteMembersViaEmailMobileComponent>,
        private formBuilder: FormBuilder,
        private communityService: CommunityService,
        private snackbar: MatSnackBar,
        private store: Store<State>,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {
        this.invitationForm = this.formBuilder.group({
            emailString: '',
            invitationText: `Hello! \n\nI’d like to invite you to our community, ${this.data?.communityName}. \n\nIt takes less than a minute to join and together we’re sharing our stories, experiences, and ideas. \n\nI know you’ll love it. \n\nSee you here!`,
        });

        this.communityService.currentCommunityBranding$$
            .pipe(takeUntil(this.destroy$$))
            .subscribe((branding) => (this.branding = branding));
    }
    onChipClick(event) {
        event.stopPropagation();
    }
    setFoucusOnInput() {
        this.emailInput.nativeElement.focus();
    }

    captureAnalytics() {
        if (this.data?.inivte_link_type == this.inivte_link_type_free) {
            this.analyticsService.sendEvent(INVITE_FLOW.FREE_MEMBER_INVITED, {
                type: 'via_email',
            });
        } else if (this.data?.inivte_link_type == this.inivte_link_type_paid) {
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
                panelClass: ['snackbar'],
            });
            return;
        }
        if (!this.invitationForm.value.invitationText) {
            this.store.dispatch(StopLoading());
            this.snackbar.open('Please provide Invitation Text to proceed', undefined, {
                duration: 5000,
                panelClass: ['snackbar'],
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
                    panelClass: ['snackbar'],
                }
            );
            return;
        }
        if (this.errorInEmailList) {
            this.store.dispatch(StopLoading());
            this.snackbar.open('One or more EmailId provided are incorrect.Please provide correct EmailId.', undefined, {
                duration: 5000,
                panelClass: ['snackbar'],
            });
            return;
        }

        const body = {
            type: 'email',
            email_id: this.emailList.join(','),
            mobile_no: '',
            text: this.invitationForm.value.invitationText,
            link_type: this.data?.inivte_link_type,
            community_id: this.data?.communityId,
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
                    this.handleBackClick();
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

    handleBackClick() {
        this.data.sheetRef.dismiss();
    }

    showPlaceHolderText() {
        if (this.emailList.length > 0) {
            this.placeHolder = '';
        } else if (this.emailList.length <= 0) {
            this.placeHolder = 'Add upto 100 emails here seperated by commas.';
        }

        return this.placeHolder;
    }

    downloadSampleEmailCsvFile() {
        let link = document.createElement('a');
        link.download = 'InviteViaEmailSample.csv';
        link.href = 'assets/sampleCsv/InviteViaEmailSample.csv';
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
        // other sorts of magic
        this.isEmailListErrorFree();
        this.store.dispatch(StopLoading());
        this.setFoucusOnInput();
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

    addNew(event: any) {
        let char = event.target.value;
        let charCode = char.charCodeAt(event?.target?.value.length - 1);
        if (charCode == 32 || event.keyCode == 13 || charCode == 44) {
            this.add(event);
        }
    }
    add(event: any): void {
        const value = (event.value || event?.target?.value || '').trim();

        // Add our fruit
        if (value) {
            this.emailList.push(this.removeCommaFromEnd(value));
        }

        // Clear the input value
        if (event.input) {
            event.input.value = '';
        }

        this.emailCtrl.setValue(null);
        this.isEmailListErrorFree();
    }

    removeCommaFromEnd(str) {
        if (str.charCodeAt(str.length - 1) == 44) {
            let tempStringArr = str.split('');
            tempStringArr.pop();
            return tempStringArr.join('');
        }

        return str;
    }

    remove(fruit: string): void {
        const index = this.emailList.indexOf(fruit);

        if (index >= 0) {
            this.emailList.splice(index, 1);
        }
        this.isEmailListErrorFree();
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

    setError() {
        // this.chipList?.errorState = true;
    }

    checkIfEmailIsCorrectorNot(email) {
        return checkIfEmailIsCorrect(email);
    }
}
