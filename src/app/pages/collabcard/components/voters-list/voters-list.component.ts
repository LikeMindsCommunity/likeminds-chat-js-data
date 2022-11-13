import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { IMember } from '../../../../shared/models/member.model';
import { VoterListService } from 'src/app/core/services/voter-list.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { response } from 'express';

@Component({
  selector: 'app-voters-list',
  templateUrl: './voters-list.component.html',
  styleUrls: ['./voters-list.component.scss']
})
export class VotersListComponent implements OnInit {

  @Input() chatroomId: number;
  @Input() pollId: number;
  votersList: IMember[] = [];
  isLoaded: boolean = false;

  showVotersList: boolean;
  pollid: number;
  isSubmitable: boolean;
  communityId: number;
  voterListSubscription: any;
  conversation_id: string | number;

  constructor(
    private chatroomService: ChatroomService,
    private voterListService: VoterListService,
    private homefeedService: HomeFeedService
  ) { }

  ngOnInit(): void {
    // this.chatroomService.fetchPollUsers(this.chatroomId, this.pollId)
    // .subscribe(response => {
    //   this.votersList = response.members;
    //   this.isLoaded = true;
    // }, error => {
    //   console.log("Error in request");
    // });
    // this.homefeedService.fetchMicropollUsers(this.)

    this.voterListSubscription = this.voterListService.votersListParamsState.subscribe(data => {
      this.showVotersList = data.showVotersList;
      this.pollid = data.pollId;
      this.isSubmitable = data.isSubmitable;
      this.communityId = data.communityId;
      this.conversation_id = data.conversation_id

      this.homefeedService.fetchMicropollUsers(this.conversation_id, this.pollId)
        .subscribe(response => {
          this.votersList = response.members;
          this.isLoaded = true;
        },
          error => {
            console.log("error in request")
          }
        )

    });
  }

  closeVoterList() {
    this.voterListService.setVoterListParams(false, this.pollid, this.isSubmitable, this.communityId, this.conversation_id);
  }

  ngOnDestroy() {
    this.voterListSubscription.complete();
  }

}
