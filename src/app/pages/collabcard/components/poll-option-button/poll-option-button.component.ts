import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMessage, IPoll } from 'src/app/shared/models/chatroom.model';
import { IUser } from 'src/app/shared/models/user.model';
import { VoterListService } from 'src/app/core/services/voter-list.service';
import { MatDialog } from '@angular/material/dialog';
import { AnonymousPollSheetComponent } from '../../entryComponents/anonymous-poll-sheet/anonymous-poll-sheet.component';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { VotersListDialogComponent } from '../../entryComponents/voters-list-dialog/voters-list-dialog.component';

@Component({
  selector: 'app-poll-option-button',
  templateUrl: './poll-option-button.component.html',
  styleUrls: ['./poll-option-button.component.scss']
})
export class PollOptionButtonComponent implements OnInit {

  @Input() option: IPoll;
  @Input() answered: boolean;
  @Input() addOption: boolean;
  @Input() user: IUser;
  @Input() singleAnswered: boolean;
  @Input() pollSubmitted: boolean;
  @Input() pollType: any;
  @Input() pollEnded: boolean;
  @Input() isAnonymous: boolean;
  @Input() isSubmitable: boolean;
  @Input() message: IMessage
  @Input() communityId: number;
  @Input() pollWasAnswered: boolean;
  @Output() clickPollButton: EventEmitter<IPoll> = new EventEmitter();
  @Output() clickVotersButton: EventEmitter<any> = new EventEmitter();
  optionPercentage: string;

  constructor(
    private voterListService: VoterListService,
    private dialog: MatDialog,
    private chatroomService: ChatroomService
  ) { }

  ngOnInit(): void {
    if (this.answered) {
      this.optionPercentage = `${100 - this.option.percentage}%`;
    }
  }

  OpenAddOptionPopup() {
    this.dialog.open(AnonymousPollSheetComponent, {
      panelClass: 'anonymous-poll-popup'
    });
  }

  selectOption(option) {
    //this.chatroomService.pollOption$$.next({option , message : this.message});
    this.clickPollButton.emit(option)
  }

  clickVote(poll_id: number, is_anonymous: boolean, no_of_votes: any) {
    if (no_of_votes == 0) {
      return;
    }
    if (is_anonymous) this.OpenAddOptionPopup();
    else {
      if (this.message.to_show_results)
        this.clickVotersButton.emit({ poll_id })
    }
    // else this.voterListService.setVoterListParams(true, poll_id, this.isSubmitable, this.communityId, this.message.id);
  }

}
