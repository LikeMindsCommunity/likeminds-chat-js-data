import { Component, OnInit, Input, Inject, PLATFORM_ID, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IMessage, IPoll } from 'src/app/shared/models/chatroom.model';
import { IUser } from 'src/app/shared/models/user.model';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';
import { VoteSubmittedSheetComponent } from '../../entryComponents/vote-submitted-sheet/vote-submitted-sheet.component';
import { VoteSubmittedPopupComponent } from '../../entryComponents/vote-submitted-popup/vote-submitted-popup.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AddPollOptionPopupComponent } from '../../entryComponents/add-poll-option-popup/add-poll-option-popup.component';
import { AddPollOptionSheetComponent } from '../../entryComponents/add-poll-option-sheet/add-poll-option-sheet.component';
import { VoterListService } from 'src/app/core/services/voter-list.service';
import { MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { CHATROOM_TYPE_MAP, MEMBER_STATE_MAP } from '../../../../shared/constants/app-constant';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { BehaviorSubject } from 'rxjs';
import { VotersListDialogComponent } from '../../entryComponents/voters-list-dialog/voters-list-dialog.component';

@Component({
  selector: 'app-poll-card',
  templateUrl: './poll-card.component.html',
  styleUrls: ['./poll-card.component.scss']
})
export class PollCardComponent implements OnInit {

  @Input() message: IMessage;
  @Input() user: IUser;
  is_answered: boolean = false;
  single_answered: boolean;
  poll_ended: boolean;
  time_remaining: string;
  endDate: string;
  pollOptions: IPoll[];
  isSubmitable: boolean = false;
  isEditable: boolean = true;
  screenType: string;
  answerText: string;
  pollId: number;
  showVoterList: boolean;
  community_id: number;
  voterListSubscription: any;
  pollWasAnswered = false;
  pollSubmitted = false;
  public pollWasAnswered$$ = new BehaviorSubject<boolean>(false);
  public is_answered$$ = new BehaviorSubject<boolean>(false);
  duplicateOptions: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private chatroomService: ChatroomService,
    private snackbar: MatSnackBar,
    private resizeService: ResizeService,
    private dialog: MatDialog,
    private sheet: MatBottomSheet,
    private voterListService: VoterListService,
    private cdr: ChangeDetectorRef,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
    }
    this.resizeService.onResize$.subscribe((response: any) => {
      this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
    });

    this.initializePollCardData();

    if (this.message?.poll_is_answered) {
      this.pollWasAnswered = true;
      this.isEditable = false;
    }

    this.chatroomService.pollOption$$.subscribe(response => {
      if (response?.option && response?.message?.id == this.message?.id) {
        ////("Option selected : ", response?.message?.id);
        this.markAnswer(response?.option);
      }
    });

  }

  initializePollCardData() {
    this.pollOptions = [...this.message.polls];
    this.pollWasAnswered$$.subscribe(res => {
      if (!res) {
        this.pollAnswered(this.pollOptions);
      }
    })

    //if (this.is_answered) this.isEditable = false;
    this.single_answered = [0, 1, 2].includes(this.message.multiple_select_state) ? false : true; // CHECK WHY DOES IT CHANGE        
    this.generateDuration(this.message.expiry_time);
    this.answerText = this.message?.poll_answer_text;

    this.voterListSubscription = this.voterListService.votersListParamsState.subscribe(data => {
      this.isSubmitable = data.isSubmitable;
      this.showVoterList = data.showVotersList;
      this.pollId = data.pollId;
      this.community_id = data.communityId;
    });
  }

  updateMicroPollData() {
    ////("hit update micropoll")
    this.is_answered = true;
    this.chatroomService.micropollUpdated$$.next(true);
  }

  openVotersList(data?: any) {
    if (!data?.poll_id) data = {
      poll_id: this.pollOptions[0].id
    };
    this.dialog.open(VotersListDialogComponent,
      {
        data: {
          type: 'conversation',
          conversation_id: this.message.id,
          poll_id: data.poll_id
        },
        panelClass: ['position-relative', 'poll-result']
      })

  }

  OpenVoteSubmittedPopup() {
    this.dialog.open(VoteSubmittedPopupComponent, {
      data: {
        'endDate': this.endDate,
      },
      panelClass: 'vote-submit-popup'
    })
  }

  OpenVoteSubmittedSheet() {
    this.sheet.open(VoteSubmittedSheetComponent, {
      data: {
        'endDate': this.endDate,
      }
    });
  }

  OpenAddOptionPopup() {

    if (this.message?.polls.length == 10) {
      this.openSnackBar("Can't add more than 10 poll options");
      return;
    }

    const optionPopup = this.dialog.open(AddPollOptionPopupComponent, {
      data: {
        //'chatroomId': this.message.chatroom_id,
        conversation_id: this.message?.id,
        pollOptions: this.message?.polls
      },
      panelClass: 'add-poll-option-popup'
    });
    optionPopup.afterClosed().subscribe(response => {
      //("modal closed")
      this.updateMicroPollData();
    });
  }

  OpenAddOptionSheet() {

    if (this.message?.polls.length == 10) {
      this.openSnackBar("Can't add more than 10 poll options");
      return;
    }

    const optionSheet = this.sheet.open(AddPollOptionSheetComponent, {
      data: {
        //'chatroomId': this.message.chatroom_id,
        conversation_id: this.message?.id,
        pollOptions: this.message?.polls
      }
    });
    optionSheet.afterDismissed().subscribe(response => {
      this.updateMicroPollData();
    })
  }


  // function to genereate the remaining time of poll
  generateDuration(expiry_date: number) {
    let endDate = moment.unix(expiry_date / 1000).format('DD/MM/YYYY HH:mm:ss');
    let startDate = moment().format('DD/MM/YYYY HH:mm:ss');

    this.endDate = endDate;

    let diff = moment.duration(moment(endDate, 'DD/MM/YYYY HH:mm:ss').diff(moment(startDate, 'DD/MM/YYYY HH:mm:ss')));

    if (diff.years() < 0 || diff.months() < 0 || diff.days() < 0 || diff.hours() < 0 || diff.minutes() < 0 || diff.seconds() < 0) {
      this.poll_ended = true;
      return;
    }

    let seconds = diff.seconds() ? (diff.seconds() > 1 ? 'few seconds' : 'a moment') : '';
    let mins = diff.minutes() ? (diff.minutes() > 1 ? diff.minutes() + ' minutes' : diff.minutes() + ' minute') : '';
    let hours = diff.hours() ? (diff.hours() > 1 ? diff.hours() + ' hours' : diff.hours() + ' hour') : '';
    let days = diff.days() ? (diff.days() > 1 ? diff.days() + ' days' : diff.days() + ' day') : '';
    let months = diff.months() ? (diff.months() > 1 ? diff.months() + ' months' : diff.months() + ' month') : '';
    let years = diff.years() ? (diff.years() > 1 ? diff.years() + ' years' : diff.years() + ' year') : '';

    if (years || months) {
      this.time_remaining = `${years ? years : ''} ${months ? months : ''}`;
      this.poll_ended = false;
      return;
    }

    if (days) {
      this.time_remaining = `${days ? days : ''}`;
      this.poll_ended = false;
      return;
    }

    if (hours || mins) {
      this.time_remaining = `${hours ? hours : ''} ${mins ? mins : ''}`;
      this.poll_ended = false;
      return;
    }

    if (seconds) {
      this.time_remaining = `${seconds ? seconds : ''}`;
      this.poll_ended = false;
      return;
    }

    return;
  }


  // utility function for submitVote function
  submitPollUtil(markedPolls: any[]) {

    let data: any = {
      'conversation_id': this.message?.id,
      "polls": markedPolls
    };

    this.chatroomService.submitMicroPoll(data)
      .pipe(filter(res => !!res && res.success))
      .subscribe(response => {
        this.is_answered$$.next(true);
        this.analyticsService.sendEvent(MIXPANEL.POLL_VOTED, {
          chatroom_id: this.message?.chatroom_id,
          community_id: this.message?.community_id,
          chatroom_type: CHATROOM_TYPE_MAP[3],
          member_state: MEMBER_STATE_MAP[this.message?.member?.state]
        });
        if (this.message.poll_type === 0) {
          this.openSnackBar('Your vote submitted successfully.');
        } else {
          if (this.screenType === 'mobile') this.OpenVoteSubmittedSheet();
          else this.OpenVoteSubmittedPopup();
        }
        this.updateMicroPollData();
        this.isEditable = false;
        this.pollSubmitted = true;
      }, error => {
        this.openSnackBar('Error while voting. Try again.');
      })
  }


  // function to check if any option
  // is already marked or not
  pollAnswered(polls: IPoll[]) {

    this.pollWasAnswered$$.next(true);
    for (let poll of polls) {
      if (poll.is_selected) {
        this.is_answered = true;
        this.is_answered$$.next(true);
        // //("entered it and answered value : ", this.is_answered)
        break;
      }
    }
    return;
  }


  // function to submit the marked options
  // when the submit button is pressed
  submitVote() {
    let markedPolls: any[] = [];

    let count = 0;
    for (let option of this.pollOptions) {
      if (option.is_selected) {
        count += 1;
      }
    }

    if (count == 0) return;

    if (this.message.multiple_select_state == 2) {
      if (this.message.multiple_select_no > count) {
        return;
      }
    }

    if (this.message.multiple_select_state == 0 || this.message.multiple_select_state == undefined) {
      if (this.message.multiple_select_no != count) {

        if (this.message.multiple_select_no == undefined && count == 1) {
          // do nothing
        }
        else return;
      }
    }

    // getting all the marked polls
    for (let option of this.pollOptions) {
      if (option.is_selected) {
        markedPolls.push({
          "id": option.id,
          "text": option.text,
          "is_selected": option?.is_selected ? option?.is_selected : false,
          "percentage": option?.percentage ? option?.percentage : 100,
          'no_votes': option?.no_votes ? option?.no_votes : 1
        })
      }
    }

    if (markedPolls.length === 0) {
      this.openSnackBar('No option selected');
      return;
    }

    this.isEditable = false;
    this.submitPollUtil(markedPolls);
    this.setSubmitableValue(false);
    return;
  }


  // function to enable editing
  // if the poll is not ended
  enableEdit() {
    this.isEditable = true;
  }


  // function to create a new
  // option on the existing poll
  addNewOption() {
    // open dialogue to ask for option details
    if (this.screenType === 'mobile') this.OpenAddOptionSheet();
    else this.OpenAddOptionPopup();
  }


  // snackbar to show all the actions
  openSnackBar(message: string) {
    this.snackbar.open(message, undefined, {
      panelClass: ['snackbar'],
      duration: 2250,
    });
  }

  setSubmitableValue(value: boolean) {
    // this.voterListService.setVoterListParams(false, this.pollId, value, this.community_id);
  }

  // function to mark the answer
  markAnswer(poll: IPoll) {
    if (this.poll_ended) {
      this.openSnackBar('Poll ended. Vote cannot be submitted now.');
      return
    }

    // getting all the marked options
    let markedCount: number = 0;
    for (let option of this.pollOptions) {
      if (option.is_selected) {
        markedCount += 1;
      }
    }

    let difference = this.message.multiple_select_no - markedCount;

    if (!this.isEditable && (this.message?.multiple_select_no == undefined || this.message?.multiple_select_no == 1) && this.message?.poll_type == 1) {

      if (this.message?.multiple_select_state == 2) {
        return;
      }

      if (poll.is_selected) {
        return;
      }

      else {
        for (let option of this.pollOptions) {
          if (option.is_selected) {
            option.is_selected = false;
          }
        }
        poll.is_selected = true;
        this.submitVote();
        return;
      }
    }

    if (this.isEditable) {
      // IF THE MULTIPLE SELECT NO IS 1 OR UNDEFINED AND STATE NOT EQUALT TO AT LEAST i.e 2.
      if (this.message?.multiple_select_no == undefined || this.message?.multiple_select_no == 1) {

        if (this.message?.multiple_select_state != 2) {

          if (poll.is_selected) {
            return;
          }

          else {
            poll.is_selected = true;
            this.submitVote();
            return;
          }
        }
      }

      // IF MULTIPLE SELECT STATE IS 2
      if (this.message?.multiple_select_state == 2) {
        //('entered 2')
        if (poll.is_selected) {
          poll.is_selected = false;
          return
        }

        else {
          poll.is_selected = true;
          if (this.message.polls?.length - markedCount == 1) {
            this.openSnackBar(`${this.message.polls?.length} options selected. Submit your vote now.`);
          }
          else {
            poll.is_selected = true;
            this.setSubmitableValue(true);
            this.openSnackBar(`${markedCount + 1} options selected. Select more options or submit your vote now.`);
          }
        }
        return;
      }

      // IF MULTIPLE SELECT STATE IS 1
      if (this.message?.multiple_select_state == 1) {
        //('entered 3')
        if (poll.is_selected) {
          poll.is_selected = false;
          return
        }

        else {
          if (difference == 1) {
            poll.is_selected = true;
            this.openSnackBar(`${this.message?.multiple_select_no} options selected. Submit your vote now.`);
          }
          else if (difference > 1) {
            poll.is_selected = true;
            this.openSnackBar(`Select more options or submit your vote now`);
          }
          else {
            this.openSnackBar(`You can select at max ${this.message?.multiple_select_no} options. Unselct an option or submit your vote now`);
          }
        }
        return;
      }

      // MULTIPLE SELECT STATE IS 0
      if (this.message?.multiple_select_state == undefined || this.message?.multiple_select_state == 0) {

        //("entered 4")
        if (poll.is_selected) {
          poll.is_selected = false;
          return
        }

        if (markedCount < this.message.multiple_select_no) {
          poll.is_selected = true;
          if (difference === 1) {
            this.openSnackBar(`${this.message.multiple_select_no} options selected. Submit your vote now.`);
          }
          else {
            this.openSnackBar(`Select ${difference - 1} more options to submit your vote.`);
          }
          return;
        }

        if (markedCount == this.message.multiple_select_no) {
          this.openSnackBar(`You can only select ${this.message.multiple_select_no} options. Unselect an option or submit your vote now.`);
          return;
        }

        return;
      }
    }

  }

  ngOnDestroy(): void {
    this.voterListSubscription.complete();
  }

}
