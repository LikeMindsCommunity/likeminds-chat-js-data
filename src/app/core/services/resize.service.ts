import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SCREEN_SIZE } from 'src/app/shared/enums/screen-size.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ResizeService {

    get onResize$(): Observable<string> {
        return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
    }

    private resizeSubject: Subject<string>;

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        this.resizeSubject = new Subject();

        if (isPlatformBrowser(platformId)) { }
    }

    onResize(size: string) {
        this.resizeSubject.next(size);
    }

}