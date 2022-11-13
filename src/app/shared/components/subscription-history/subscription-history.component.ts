import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from '../../store/actions/app.action';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss']
})
export class SubscriptionHistoryComponent implements OnInit {

  subscriptionHistory : Object ;
  communityImageUrl : string;

  constructor(
    private subscriptionService : SubscriptionService,
    private route : ActivatedRoute,
    private store: Store<State>,   
    private homeFeedService : HomeFeedService
  ) { }

  ngOnInit(): void {    
    this.route.queryParams.subscribe(qparam=>{
      this.store.dispatch(StartLoading())    
      this.subscriptionService.fetchSubscriptionHistory({'community_id': qparam?.community_id}).subscribe(history=>{              
        this.subscriptionHistory = history?.subscription_history;
        this.store.dispatch(StopLoading());
        this.homeFeedService.communityGroup$.subscribe(myCommunities=>{
          myCommunities.forEach(community => {
            if(community?.id == qparam?.community_id){
              this.communityImageUrl = community?.image_url
            }
          });
        })
      })
    })
  }

  formatStartDate(time){
    let startDate = new Date(time)
    return `${`${startDate.getDate().toString().length == 1 ? `0${startDate.getDate()}` : startDate.getDate()}` + "/" + `${startDate.getMonth().toString().length == 1 ? `0${startDate.getMonth()+1}` : startDate.getMonth()+1}` + "/" + startDate.getFullYear().toString().slice(2,4)}`
  }

  showActive(endDate){
    let currentTime = new Date()
    return endDate - currentTime.getTime();
  }

  subscriptionPeriod(history){
    let startDate = new Date(history?.start_date);
    let endDate = new Date(history?.end_date);
    return `${startDate.getDate()} ${startDate.toLocaleDateString('default', { month: 'short' })} '${startDate.getFullYear().toString().slice(2,4)} to
    ${endDate.getDate()} ${endDate.toLocaleDateString('default', { month: 'short' })} '${endDate.getFullYear().toString().slice(2,4)}`
  }

}
