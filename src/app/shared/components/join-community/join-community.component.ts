import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICommunity } from '../../models/community.model';
import { IMember, IMemberState } from '../../models/member.model';
import { IUser } from '../../models/user.model';
import { COMMUNITY_FEED_PATH } from '../../constants/routes.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.component.html',
  styleUrls: ['./join-community.component.scss']
})
export class JoinCommunityComponent implements OnInit {

  @Input() memberState: IMemberState;
  @Input() user: IUser;
  @Input() community: ICommunity;
  @Input() admins: IMember[]
  @Input() isMobile: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  joinCommunity() {
    if (!this.user) {
      this.close.emit(`/${COMMUNITY_FEED_PATH}/${this.community.id}?page=generate_otp`);
      return;
    }

    if (![1, 3, 4, 9].includes(this.memberState.state)) {
      this.close.emit(`/${COMMUNITY_FEED_PATH}/${this.community.id}`);
    }
  }

}
