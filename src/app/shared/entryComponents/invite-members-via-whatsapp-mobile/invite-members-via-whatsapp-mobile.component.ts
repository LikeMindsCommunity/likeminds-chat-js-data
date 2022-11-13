import { Component, OnInit, Inject, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { CommunityService } from 'src/app/core/services/community.service';
import { readFileContent } from '../../utils';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { INVITE_FLOW } from '../../enums/mixpanel.enum';
@Component({
  selector: 'app-invite-members-via-whatsapp-mobile',
  templateUrl: './invite-members-via-whatsapp-mobile.component.html',
  styleUrls: ['./invite-members-via-whatsapp-mobile.component.scss']
})
export class InviteMembersViaWhatsappMobileComponent implements OnInit {
  invitationForm = this.formBuilder.group({
    whatsAppString: '',
    invitationText: ''
  });
  maxWhatsAppNoCount = 100
  inivte_link_type_free = 'free';
  inivte_link_type_paid = 'paid';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  whatsAppCtrl = new FormControl();
  whatsAppList: string[] = [];
  errorInWhatsAppList: boolean = false;
  placeHolder: string = 'Upto 100 phone numbers with country code separated by (,)commas';
  private destroy$$ = new Subject();
  branding: any;
  @ViewChild('whatsAppInput') whatsAppInput: ElementRef<HTMLInputElement>;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      closeBottomSheet: () => void,
      sheetRef,
      inivte_link_type,
      communityId,
      communityName
    },
    private formBuilder: FormBuilder,
    private communityService: CommunityService,
    private snackbar: MatSnackBar,
    private store: Store<State>,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.communityService.currentCommunityBranding$$.pipe(takeUntil(this.destroy$$)).subscribe(branding => this.branding = branding)
  }

  onChipClick(event) {
    event.stopPropagation()
  }
  setFoucusOnInput() {
    this.whatsAppInput.nativeElement.focus()
  }


  captureAnalytics() {
    if (this.data?.inivte_link_type == this.inivte_link_type_free) {

      this.analyticsService.sendEvent(INVITE_FLOW.FREE_MEMBER_INVITED, {
        type: 'via_whatsapp'
      })
    }
    else if (this.data?.inivte_link_type == this.inivte_link_type_paid) {
      this.analyticsService.sendEvent(INVITE_FLOW.PAID_MEMBER_INVITED, {
        type: 'via_whatsapp'
      })
    }
  }


  addInWhatsAppList(val) {
    const value = (val || '').trim();

    if (value) {
      this.whatsAppList.push(value);
    }

    this.whatsAppCtrl.setValue(null);
    this.isWhatsAppListErrorFree()
  }

  checkDataAndSendInvite() {
    if (this.whatsAppCtrl.value) {
      this.addInWhatsAppList(this.whatsAppCtrl.value)

    }
    this.onSend()
  }

  onSend() {
    this.store.dispatch(StartLoading());
    if (this.whatsAppList.length <= 0) {
      this.store.dispatch(StopLoading());
      this.snackbar.open('Please provide atleast 1 Mobile no. to send invite to', undefined, {
        duration: 5000,
        panelClass: ['snackbar']
      });
      return
    }
    if (this.whatsAppList.length > this.maxWhatsAppNoCount) {
      this.store.dispatch(StopLoading());
      this.snackbar.open(`More than 100 whatsapp no. are added.Please remove ${this.whatsAppList.length - this.maxWhatsAppNoCount} whatsapp no. to proceed.`, undefined, {
        duration: 5000,
        panelClass: ['snackbar']
      });
      return
    }
    if (this.errorInWhatsAppList) {
      this.store.dispatch(StopLoading());
      this.snackbar.open('One or more WhatsApp No. provided are incorrect.Please provide correct WhatsApp No.', undefined, {
        duration: 5000,
        panelClass: ['snackbar']
      });
      return
    }

    const body = {
      type: 'whatsapp',
      email_id: '',
      mobile_no: this.whatsAppList.join(","),
      text: this.invitationForm.value.invitationText,
      link_type: this.data?.inivte_link_type,
      community_id: this.data?.communityId
    }
    this.communityService.sendInviteLinks(body).pipe(takeUntil(this.destroy$$)).subscribe((res) => {

      if (!res?.success) {
        this.store.dispatch(StopLoading());
        this.snackbar.open(res?.error_message, undefined, {
          duration: 5000,
          panelClass: ['snackbar-error']
        });

        return
      }
      this.handleBackClick()
      this.store.dispatch(StopLoading());
      this.captureAnalytics();
      this.snackbar.open('Invitations sent successfully', undefined, {
        duration: 5000,
        panelClass: ['snackbar']
      });
    }, (err) => {
      this.snackbar.open(err?.error?.error_message, undefined, {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    })

  }
  handleBackClick() {
    this.data.sheetRef.dismiss();
  }

  showPlaceHolderText() {
    if (this.whatsAppList.length > 0) {
      this.placeHolder = "";
    }
    else if (this.whatsAppList.length <= 0) {
      this.placeHolder = 'Upto 100 phone numbers with country code separated by (,)commas.';
    }

    return this.placeHolder
  }

  downloadSampleWhatsAppCsvFile() {
    let link = document.createElement("a");
    link.download = "InviteViaWhatsappSample.csv";
    link.href = "assets/sampleCsv/InviteViaWhatsappSample.csv";
    link.click();
  }

  processCsv(content) {
    this.store.dispatch(StartLoading());
    let contentArray = content.split('\n');
    if (contentArray.length == 0 || contentArray.length <= 1) {
      this.snackbar.open('No data found in CSV while parsing.', undefined, {
        duration: 5000,
        panelClass: ['snackbar']
      });
      return
    }

    contentArray.shift();
    if (contentArray[contentArray.length - 1] == '') {
      contentArray.pop();
    }
    this.whatsAppList = contentArray.slice();
    this.isWhatsAppListErrorFree();
    // other sorts of magic
    this.store.dispatch(StopLoading());
    this.setFoucusOnInput()
  }

  convertFile(event: any) {
    const file = event.target.files[0];
    readFileContent(file).then(content => {
      // Operate your string as required in a separate function
      this.processCsv(content)
    }).catch(error => console.log(error))
  }


  addNew(event: any) {
    console.log(event.keyCode)
    let char = event.target.value;
    let charCode = char.charCodeAt(event?.target?.value.length - 1)
    if (event.keyCode == 13 || charCode == 44) {
      this.add(event)
    }
  }

  add(event: any): void {
    const value = (event.value || event?.target?.value || '').trim();

    // Add our fruit
    if (value) {
      this.whatsAppList.push(this.removeCommaFromEnd(value));
    }

    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }

    this.whatsAppCtrl.setValue(null);
    this.isWhatsAppListErrorFree();
  }

  removeCommaFromEnd(str) {
    if (str.charCodeAt(str.length - 1) == 44) {
      let tempStringArr = str.split("");
      tempStringArr.pop();
      return tempStringArr.join('');
    }

    return str
  }

  remove(fruit: string): void {
    const index = this.whatsAppList.indexOf(fruit);

    if (index >= 0) {
      this.whatsAppList.splice(index, 1);
    }
    this.isWhatsAppListErrorFree();
  }

  checkIfMobileNumberisValid(mobileNo) {
    if (mobileNo && mobileNo.trim().length > 5 && mobileNo.trim().length <= 15) {
      return true
    }
    else {
      return false
    }
  }

  isWhatsAppListErrorFree(): void {
    if (this.whatsAppList.length > 0) {
      this.whatsAppList.every((phone) => {
        if (!this.checkIfMobileNumberisValid(phone)) {
          this.errorInWhatsAppList = true
          return false
        }
        else {
          this.errorInWhatsAppList = false;
          return true
        }
      })
    } else {
      this.errorInWhatsAppList = false;
    }

  }
}
