import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MEMBER_STATE } from 'src/app/shared/enums/member-state.enum';

@Component({
    selector: 'members-attending-section',
    templateUrl: './members-attending.component.html',
    styleUrls: ['./members-attending.component.scss']
})

export class MembersAttendingComponent implements OnInit, OnChanges {
    @Input() members: any[];
    screenType: string;
    remainingMembersCount = 0;
    constructor() { }
    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.members && changes.members.currentValue) {
            this.members = this.members
                .filter(member => [MEMBER_STATE.ADMIN, MEMBER_STATE.MEMBER, MEMBER_STATE.SKIPPED].includes(member.state) && member.attending_status)
                .sort((a, b) => a.custom_title === b.custom_title ? 0 : (a.custom_title ? -1 : 1));
            const totalLength = this.members.length;
            this.screenType = window.innerWidth <= 426 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
            const screenType = this.screenType;
            let maxToBeShown = screenType === 'mobile' ? 3 : 5;
            this.members = this.members.reduce((items, item, i) => {
                if (i < maxToBeShown || totalLength === maxToBeShown + 1) items = [...items, { ...item, show: true, isLastTile: false }];
                else if (i === maxToBeShown) items = [...items, { ...item, show: true, isLastTile: true }];
                return items;
            }, []);
            this.remainingMembersCount = totalLength - maxToBeShown;
        }
    }
}