import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InitSdkService {
    public sdkInfo$$ = new BehaviorSubject<any>([]);

    constructor() {}

    public get sdkInfo$(): Observable<any> {
        return this.sdkInfo$$.asObservable();
    }
}
