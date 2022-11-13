import { ActionReducer, Action } from '@ngrx/store';
import { State } from '.';

export function metaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    // a function with the exact same signature of a reducer
    return function (state: State, action: Action) {
        return reducer(state, action);
    };
}