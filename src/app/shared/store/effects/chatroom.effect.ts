import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { ChatroomActions } from '../actions';
import { ChatroomService } from '../../../core/services/chatroom.service';
import { Payload } from '../../models/app.model';

@Injectable()
export class ChatroomEffects {

    // getChatroomDetails$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(ChatroomActions.GetChatroomDetailAction),
    //         exhaustMap(action =>
    //             this.chatroom.getChatroomDetail(action.payload).pipe(
    //                 map(response => ChatroomActions.GetChatroomDetailSuccessAction(new Payload(response.data))),
    //                 catchError(error => of(ChatroomActions.GetChatroomDetailFailureAction(error)))
    //             )
    //         )
    //     )
    // );

    constructor(
        private actions$: Actions,
        private chatroom: ChatroomService
    ) { }
}