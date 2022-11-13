import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { SubscriptionService} from 'src/app/core/services/subscription.service'

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  paymentId : any;
  communityId : any;
  showContent = false;
  communityName : string;
  feed_url : string = null;
  screenType : string;
  privateLink : string = null;


  constructor(
    private route : ActivatedRoute,
    private localStorageService : LocalStorageService,
    private router : Router,
    private subscriptionService : SubscriptionService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(qparams=>{
      let paymentIdObject =  this.localStorageService.getSavedState(STORAGE_KEY.PAYMENT_ID_SUCCESS);

      console.log("THE ROUTE : ", qparams )

      this.subscriptionService.fetchOTLUrl({payment_id : qparams?.payment_id, community_id : qparams?.community_id }).subscribe(res=>{
        this.privateLink = res?.private_link;
      })
      
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        this.feed_url = this.localStorageService.getSavedState("feed_url");
      }
      
    })
  }

}
