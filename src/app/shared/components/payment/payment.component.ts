import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from 'src/app/core/services/community.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { COMMUNITY_PAY, ROOT_PATH, SUCCESS } from '../../constants/routes.constant';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { IUser } from '../../models/user.model';
import {EventsService}  from  "../../../core/services/events.service"
declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  user: IUser;
  event_plan_id : string;
  payment_page_url : string;
  plan_id : string;
  user_id : string | number;
  communityId : string | number;
  communityName : string;
  renew : boolean | string;
  payment_id : string;
  chatroom_id : string;
  freeEvent : string;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private communityService: CommunityService,
    private eventService : EventsService,    
    // private location: Location,
  ) { }

  ngOnInit(): void {
    //this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
      
    this.route.queryParams.subscribe((qparams) => {
      this.event_plan_id = qparams?.event_plan_id;
      this.plan_id = qparams?.plan_id;
      this.user_id = qparams?.user_id;
      this.renew = qparams?.renew;
      this.payment_page_url = window.location.href;
      this.chatroom_id = qparams?.chatroom_id;
      this.freeEvent = qparams?.free_event

      let body = {}

      /// 1)

      if(this.event_plan_id && this.plan_id){
        //.let body =
        body = {
          event_plan_id : this.event_plan_id,
          plan_id : this.plan_id,
          user_id : this.user_id ,
          renew : this.renew,
          payment_page_url : window.location.href,        
        }

        if(this.renew){
          body["user_id"] = this.user_id;
        }

        this.subscriptionService.createCommunityEventRazorpayOrder(body).subscribe((res) => {

          let order_id = res['order']['order_id'];
          res['order']['handler'] = (response) => {
              let data = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: order_id,
              };
  
              this.subscriptionService.verifyOrder(data).subscribe(
                  (res) => {
                      if (res.success) {
  
                        this.subscriptionService.fetchPlansFromSubscriptionsIds(this.plan_id)
                        .subscribe(result=>{

                          this.communityId = result?.plans?.length > 0 ? result?.plans[0]['community_id'] : null;
                          this.communityName = result?.plans?.length > 0 ? result?.plans[0]['community_name'] : null;
                   
                          /////////////////////////////
                          this.communityService.getCommunityFeedUrl(this.communityId).subscribe((res) => {

                            if (res.success) {
                                this.localStorageService.setSavedState(res.feed_url, 'feed_url');
                                this.payment_id = response.razorpay_payment_id;
                                this.localStorageService.setSavedState(
                                    {
                                        payment_id: response.razorpay_payment_id,
                                        community_id: this.communityId,
                                        community_name: this.communityName,
                                    },
                                    STORAGE_KEY.PAYMENT_ID_SUCCESS
                                );
  
                                if(this.renew==='true'){
                                  window.location.href =
                                  window.location.origin +
                                  `/renewal/success?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                                }
  
                                else{
                                  // window.location.href = window.location.origin + '/' + COMMUNITY_PAY + "/" + SUCCESS
                                  window.location.href = window.location.origin + '/' + COMMUNITY_PAY + "/" + SUCCESS +
                                  "?community_id=" + `${this.communityId}` + `&payment_id=${this.payment_id}`
                                }
  
  
                            } else {
                                this.router.navigate([`${ROOT_PATH}`]);
                            }
                          });
                          /////////////////////////////
                        }            
                      )
  
  
                      } else {
  
                          this.localStorageService.setSavedState(
                              { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                              STORAGE_KEY.PAYMENT_ID_FAIL
                          );
                          window.location.href =
                              window.location.origin +
                              `/renewal/failure?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                      }
                  },
                  (err) => {
                      this.localStorageService.setSavedState(
                          { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                          STORAGE_KEY.PAYMENT_ID_FAIL
                      );
                      window.location.href =
                          window.location.origin +
                          `/renewal/failure?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                  }
              );
         
            };
  
          var rzp1 = new Razorpay(res['order']);
          rzp1.on('payment.failed', function (response) {});
  
          rzp1.open();
        });

      }  

      /// 2)
      
      if(this.event_plan_id && !this.plan_id){
        console.log("Entered second console", this.event_plan_id)
        body = {
          event_plan_id : this.event_plan_id,
          user_id : this.user_id,
          //renew : this.renew,
          payment_page_url : window.location.href,        
        }

        this.subscriptionService.createEventSubscription(body).subscribe(res=>{
          let order_id = res['order']['order_id'];
          res['order']['handler'] = (response) => {
              let data = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: order_id,
              };
  
              this.subscriptionService.verifyOrder(data).subscribe(
                  (res) => {
                      if (res.success) {

                        this.eventService.fetchMetaFromEventId(this.event_plan_id).subscribe((result : any)=>{
                          console.log("EVENT META : ", result);
                          let chatroomId = result?.event_plans[0]?.chatroom_id;
                          let communityId = result?.event_plans[0]?.community_id;

                          window.location.href =
                          window.location.origin +
                          `/event_pay/event_pay_success?payment_id=${response.razorpay_payment_id}&chatroom_id=${chatroomId}&community_id=${communityId}`;

                        })

  
                      //   this.subscriptionService.fetchPlansFromSubscriptionsIds(this.plan_id)
                      //   .subscribe(result=>{
                      //     console.log("This is response 2 : ", result);
                      //     this.communityId = result?.plans?.length > 0 ? result?.plans[0]['community_id'] : null;
                      //     this.communityName = result?.plans?.length > 0 ? result?.plans[0]['community_name'] : null;
                   
                      //     /////////////////////////////
                      //     this.communityService.getCommunityFeedUrl(this.communityId).subscribe((res) => {
                      //       console.log("This is community ID and its result", this.communityId , res);
                      //       if (res.success) {
                      //           this.localStorageService.setSavedState(res.feed_url, 'feed_url');
                      //           this.localStorageService.setSavedState(
                      //               {
                      //                   payment_id: response.razorpay_payment_id,
                      //                   community_id: this.communityId,
                      //                   community_name: this.communityName,
                      //               },
                      //               STORAGE_KEY.PAYMENT_ID_SUCCESS
                      //           );
  
                      //           if(this.renew==='true'){
                      //             window.location.href =
                      //             window.location.origin +
                      //             `/renewal/success?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                      //           }
  
                      //           else{
                      //             window.location.href = window.location.origin + '/' + COMMUNITY_PAY + "/" + SUCCESS
                      //           }
  
  
                      //       } else {
                      //           this.router.navigate([`${ROOT_PATH}`]);
                      //       }
                      //     });
                      //     /////////////////////////////
                      //   }            
                      // )
                  
  
                      } else {
  
                          this.localStorageService.setSavedState(
                              { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                              STORAGE_KEY.PAYMENT_ID_FAIL
                          );

                          // window.location.href =
                          // window.location.origin +
                          // `/event_pay/event_pay_success?payment_id=${response.razorpay_payment_id}&chatroom_id=${this.eventObj.chatroom_id}&community_id=${this.eventObj.community_id}`;
                      }
                  },
                  (err) => {
                      this.localStorageService.setSavedState(
                          { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                          STORAGE_KEY.PAYMENT_ID_FAIL
                      );
                      window.location.href =
                          window.location.origin +
                          `/renewal/failure?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                  }
              );
         
            };
  
          var rzp1 = new Razorpay(res['order']);
          rzp1.on('payment.failed', function (response) {});
  
          rzp1.open();
        })
      }

      /// 3)

      if(!this.event_plan_id && this.plan_id){
        console.log("Entered third console")
        body = {
          event_plan_id : this.event_plan_id,
          plan_id : this.plan_id,
          user_id : this.renew ? this.user_id : null,
          renew : this.renew,
          payment_page_url : window.location.href,        
        }

        this.subscriptionService.createRazorPayOrder(body).subscribe((res) => {

          let order_id = res['order']['order_id'];
          res['order']['handler'] = (response) => {
              let data = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: order_id,
              };
  
              this.subscriptionService.verifyOrder(data).subscribe(
                  (res) => {
                      if (res.success) {
  
                        this.subscriptionService.fetchPlansFromSubscriptionsIds(this.plan_id)
                        .subscribe(result=>{
                          console.log("This is response 2 : ", result);
                          this.communityId = result?.plans?.length > 0 ? result?.plans[0]['community_id'] : null;
                          this.communityName = result?.plans?.length > 0 ? result?.plans[0]['community_name'] : null;
                   
                          /////////////////////////////
                          this.communityService.getCommunityFeedUrl(this.communityId).subscribe((res) => {
                            if (res.success) {
                                if(this.freeEvent) this.doEventAttend();
                                this.localStorageService.setSavedState(res.feed_url, 'feed_url');
                                this.payment_id = response.razorpay_payment_id //
                                this.localStorageService.setSavedState(
                                    {
                                        payment_id: response.razorpay_payment_id,
                                        community_id: this.communityId,
                                        community_name: this.communityName,
                                    },
                                    STORAGE_KEY.PAYMENT_ID_SUCCESS
                                );
  
                                if(this.renew==='true'){
                                  window.location.href =
                                  window.location.origin +
                                  `/renewal/success?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                                }
  
                                else{
                                  window.location.href = window.location.origin + '/' + COMMUNITY_PAY + "/" + SUCCESS +
                                  "?community_id=" + `${this.communityId}` + `&payment_id=${this.payment_id}`
                                }
  
  
                            } else {
                                this.router.navigate([`${ROOT_PATH}`]);
                            }
                          });
                          /////////////////////////////
                        }            
                      )
  
  
                      } else {
  
                          this.localStorageService.setSavedState(
                              { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                              STORAGE_KEY.PAYMENT_ID_FAIL
                          );
                          window.location.href =
                              window.location.origin +
                              `/renewal/failure?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                      }
                  },
                  (err) => {
                      this.localStorageService.setSavedState(
                          { payment_id: response.razorpay_payment_id, community_id: this.communityId },
                          STORAGE_KEY.PAYMENT_ID_FAIL
                      );
                      window.location.href =
                          window.location.origin +
                          `/renewal/failure?payment_id=${response.razorpay_payment_id}&community_id=${this.communityId}`;
                  }
              );
         
            };
  
          var rzp1 = new Razorpay(res['order']);
          rzp1.on('payment.failed', function (response) {});
  
          rzp1.open();
        });
      }
      
    });

  }

  doEventAttend() {
    const paramObj = {
        // chatroom_id: this.ticketCost?.event_plans[0]?.chatroom_id,
        chatroom_id: this.chatroom_id,
        attending_status: true,
    };
    this.eventService.eventAttend(paramObj).subscribe((res) => {
        if (res) {
            location.reload();
        }
    });
}

}
