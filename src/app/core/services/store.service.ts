import { Injectable } from '@angular/core';
import { Action, ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { State } from 'src/app/shared/store/reducers';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    dispatch(arg0: any) {
      throw new Error('Method not implemented.');
    }
    constructor(private store: Store<State>, private actionsSubject: ActionsSubject) { }

    waitForEffectSuccess(inputAction: Action): Observable<any> {
        const success = inputAction.type + ' Success';
        const failure = inputAction.type + ' Failure';
        this.store.dispatch(inputAction);
        return this.actionsSubject.pipe(
            filter(a => a.type === success || a.type === failure),
            first(),
            switchMap(a => new Observable((observer) => {
                if (a.type === success)
                    observer.next((<any>a).payload);
                else
                    observer.error((<any>a).payload);
                observer.complete();
            }))
        );
    }
}
