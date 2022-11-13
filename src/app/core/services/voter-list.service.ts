import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoterListService {

  private voterListParams = new BehaviorSubject({ showVotersList: false, pollId: null, isSubmitable: false, communityId: null, conversation_id: null });
  votersListParamsState = this.voterListParams.asObservable();

  constructor() { }

  setVoterListParams(showVoterList: boolean, pollId: number, isSubmitable: boolean, communityId: number, conversation_id: number | string) {
    let params = { showVotersList: showVoterList, pollId: pollId, isSubmitable: isSubmitable, communityId: communityId, conversation_id }
    this.voterListParams.next(params);
  }
}
