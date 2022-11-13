import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { ICommunity } from '../../models/community.model';
import { Store, select } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';

import { getHeader } from '../../store/selectors/app.selector';
import { SetHeaderAction } from '../../store/actions/app.action';
import { getCommunityIdSelector } from '../../store/selectors/auth.selector';
import { GetCommunityDetailsAction, GetCommunityAdminListAction } from '../../store/actions/community.action';
import { getCommunityDetails, getAdmins } from '../../store/selectors/community.selector';
import { Payload } from '../../models/app.model';
import { State } from '../../store/reducers';

@Component({
    selector: 'community-card',
    templateUrl: './community-card.component.html',
    styleUrls: ['./community-card.component.scss']
})

export class CommunityCardComponent implements OnInit, OnChanges, OnDestroy {
    @Input() readMoreCount: number;
    @Input() headerType: string;

    @Output() title: EventEmitter<string> = new EventEmitter();

    community: ICommunity;
    admins: any;

    subscriptions: Subscription[] = [];

    constructor(private store: Store<State>) { }

    ngOnInit(): void {
        this.getData();
        this.getCommunityInfo();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.headerType && changes.headerType.currentValue) {
            this.getData();
        }
    }

    /**
     * @function getCommunityInfo
     * @description This function is used to get community ID and aj to fetch community details
     */
    getCommunityInfo(): void {
        let subscription: Subscription = this.store.pipe(select(getCommunityIdSelector))
            .subscribe(response => {
                if (!response || this.community) return;
                this.store.dispatch(GetCommunityDetailsAction(new Payload(response)));
                this.store.dispatch(GetCommunityAdminListAction(new Payload({ community_id: response.communityId })));
            }, error => { },
                () => subscription.unsubscribe())
    }

    getData(): void {
        combineLatest(
            this.store.pipe(select(getHeader, { type: this.headerType })),
            this.store.pipe(select(getAdmins)),
            this.store.pipe(select(getCommunityDetails))
        ).subscribe((response: any[]) => {
            if (response[0]) this.title.emit(response[0].title);
            if (response[0] && !response[0].isChatroom) this.store.dispatch(SetHeaderAction({ payload: response[0] }));
            this.admins = response[1] ? response[1] : [];
            this.community = response[2];
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}