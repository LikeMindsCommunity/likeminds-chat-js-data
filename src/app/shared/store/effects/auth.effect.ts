import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Payload } from '../../models/app.model';
import { AuthActions } from '../actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

    generateOtp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.GenerateOtpAction),
            exhaustMap(action =>
                this.authService.generateOtp(action.payload).pipe(
                    map(response => AuthActions.GenerateOtpSuccessAction(new Payload(response))),
                    catchError(error => of(AuthActions.GenerateOtpFailureAction(error)))
                )
            )
        )
    );

    generateOtpForMergeAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.GenerateOtpForMergeAccountAction),
            exhaustMap(action =>
                this.authService.generateOtp(action.payload).pipe(
                    map(response => AuthActions.GenerateOtpForMergeAccountSuccessAction(new Payload(response))),
                    catchError(error => of(AuthActions.GenerateOtpForMergeAccountFailureAction(error)))
                )
            )
        )
    );

    verifyOtp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.VerifyOtpAction),
            exhaustMap(action =>
                this.authService.verifyOtp(action.payload).pipe(
                    map(response => AuthActions.VerifyOtpSuccessAction(new Payload(response))),
                    catchError(error => of(AuthActions.VerifyOtpFailureAction(error)))
                )
            )
        )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LoginAction),
            exhaustMap(action =>
                this.authService.login(action.payload).pipe(
                    map(response => AuthActions.LoginSuccessAction(new Payload(response))),
                    catchError(error => of(AuthActions.LoginFailureAction(error)))
                )
            )
        )
    );

    mergeAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.MergeAccountAction),
            exhaustMap(action =>
                this.authService.mergeAccount(action.payload).pipe(
                    map(response => AuthActions.MergeAccountSuccessAction(new Payload(response))),
                    catchError(error => of(AuthActions.MergeAccountFailureAction(error)))
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) { }
}