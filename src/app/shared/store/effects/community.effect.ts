import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { CommunityActions } from '../actions';
import { CommunityService } from 'src/app/core/services/community.service';
import { Payload } from '../../models/app.model';

@Injectable()
export class CommunityEffects {

    getMemberState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetMemberStateAction),
            exhaustMap(action =>
                this.communityService.getMemberState(action.payload).pipe(
                    map(response => CommunityActions.GetMemberStateSuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.GetMemberStateFailureAction(error)))
                )
            )
        )
    );

    getQuestions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetQuestionsAction),
            exhaustMap(action =>
                this.communityService.getQuestions(action.payload).pipe(
                    map(response => CommunityActions.GetQuestionsSuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.GetQuestionsFailureAction(error)))
                )
            )
        )
    );

    getCommunityDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetCommunityDetailsAction),
            exhaustMap(action =>
                this.communityService.getCommunityDetails(action.payload).pipe(
                    map(response => CommunityActions.GetCommunityDetailsSuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.GetCommunityDetailsFailureAction(error)))
                )
            )
        )
    );

    getCommunityAdminsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetCommunityAdminListAction),
            exhaustMap(action =>
                this.communityService.getCommunityAdminList(action.payload).pipe(
                    map(response => CommunityActions.GetCommunityAdminListSuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.GetCommunityAdminListFailureAction(error)))
                )
            )
        )
    );

    getCommunityMembersList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetAllMemberAction),
            exhaustMap(action =>
                this.communityService.getAllMembers(action.payload).pipe(
                    map(response => CommunityActions.GetAllMemberSuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.GetAllMemberFailureAction(error)))
                )
            )
        )
    );

    joinCommunity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.JoinCommunityAction),
            exhaustMap(action =>
                this.communityService.joinCommunity(action.payload).pipe(
                    map(response => CommunityActions.JoinCommunitySuccessAction(new Payload(response))),
                    catchError(error => of(CommunityActions.JoinCommunityFailureAction(error)))
                )
            )
        )
    );

    introExamples$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetIntroExamplesAction),
            exhaustMap(action =>
                this.communityService.getIntroExamples().pipe(
                    map(response => CommunityActions.GetIntroExamplesSuccessAction(new Payload(response.intro_examples))),
                    catchError(error => of(CommunityActions.GetIntroExamplesFailureAction(error)))
                )
            )
        )
    );

    communityChatroomFeed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.GetCommunityChatroomFeedAction),
            exhaustMap(action =>
                this.communityService.getCommunityChatroomFeed(action.payload).pipe(
                    map(response => CommunityActions.GetCommunityChatroomFeedSuccessAction(new Payload(response.chatrooms))),
                    catchError(error => of(CommunityActions.GetCommunityChatroomFeedFailureAction(error)))
                )
            )
        )
    );

    skipCommunity$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CommunityActions.SkipCommunityAction),
        exhaustMap(action =>
            this.communityService.skipCommunity(action.payload).pipe(
                map(response => CommunityActions.SkipCommunitySuccessAction(new Payload({}))),
                catchError(error => of(CommunityActions.SkipCommunityFailureAction(error)))
            )
        )
    )
);

    constructor(
        private actions$: Actions,
        private communityService: CommunityService
    ) { }
}