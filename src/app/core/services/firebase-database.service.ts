import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filter, skip, switchMap, takeUntil } from 'rxjs/operators';
import { ChatroomService } from './chatroom.service';
import { HomeFeedService } from './home-feed.service';
import { STORAGE_KEY } from '../../shared/enums/storage-keys.enum';

@Injectable({
    providedIn: 'root',
})
export class FirebaseDatabaseService implements OnDestroy {
    private dbPath = '/collabcards/';
    private messages$$ = new BehaviorSubject<any>(null);
    firebaseDbSub: Subscription;
    firebaseHomeFeedSub: Subscription;

    public get message$(): Observable<any> {
        return this.messages$$.asObservable();
    }

    constructor(private db: AngularFireDatabase, private chatroomService: ChatroomService, private homefeedService: HomeFeedService) {}

    listenToDb(id): void {
        if (this.firebaseDbSub) {
            this.clearDbSubscription();
        }
        this.firebaseDbSub = this.db
            .list(`${this.dbPath}/${id}`)
            .valueChanges()
            .pipe(
                skip(1),
                switchMap((res: { answer_id }[]) => {
                    return this.chatroomService.getMessageDetail(id, res[0].answer_id);
                })
            )
            .subscribe((res: any) => {
                this.messages$$.next(res);
            });
    }

    listenToHomeFeed(): void {
        if (this.firebaseHomeFeedSub) {
            this.clearHomeFeedSubscription();
        }
        const user = JSON.parse(localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER));
        this.firebaseHomeFeedSub = this.db
            .list(`users/${user.id}`)
            .valueChanges()
            .pipe(
                skip(1),
                filter((res) => !!res && res.length > 0)
            )
            .subscribe((res: any) => {
                this.homefeedService.getHomeFeedUpdate(res[0]);
            });
    }

    clearDbSubscription(): void {
        if (!this.firebaseDbSub) return;
        this.firebaseDbSub.unsubscribe();
        this.firebaseDbSub = null;
    }

    clearHomeFeedSubscription(): void {
        if (!this.firebaseHomeFeedSub) return;
        this.firebaseHomeFeedSub.unsubscribe();
        this.firebaseHomeFeedSub = null;
    }

    ngOnDestroy(): void {
        this.clearDbSubscription();
        this.clearHomeFeedSubscription();
    }
}
