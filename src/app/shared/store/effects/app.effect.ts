import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { AppActions } from '../actions';
import { AppServices } from '../../../core/services/app.service';
import { Payload } from '../../models/app.model';

@Injectable()
export class AppEffects {
    getTermsAndConditions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.GetTermsAndConditionsAction),
            exhaustMap((action) =>
                this.appService.getTermsAndConditions().pipe(
                    map((response) => AppActions.GetTermsAndConditionsSuccessAction(new Payload(response.data))),
                    catchError((error) => of(AppActions.GetTermsAndConditionsFailureAction(error)))
                )
            )
        )
    );

    getPrivacyPolicy$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.GetPrivacyPolicyAction),
            exhaustMap((action) =>
                this.appService.getPrivacyPolicy().pipe(
                    map((response) => AppActions.GetPrivacyPolicySuccessAction(new Payload(response.data))),
                    catchError((error) => of(AppActions.GetPrivacyPolicyFailureAction(error)))
                )
            )
        )
    );

    // getHeadersData$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AppActions.GetHeaderDataAction),
    //         exhaustMap((action) =>
    //             this.appService.getHeaderData().pipe(
    //                 map((response) => AppActions.GetHeaderDataSuccessAction(new Payload(response))),
    //                 catchError((error) => of(AppActions.GetHeaderDataFailureAction(error)))
    //             )
    //         )
    //     )
    // );

    getCountryCodes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.GetCountryCodesAction),
            exhaustMap((action) =>
                this.appService.getCountryCodes().pipe(
                    map((response) => AppActions.GetCountryCodesSuccessAction(new Payload(response))),
                    catchError((error) => of(AppActions.GetCountryCodesFailureAction(error)))
                )
            )
        )
    );

    constructor(private actions$: Actions, private appService: AppServices) {}
}
