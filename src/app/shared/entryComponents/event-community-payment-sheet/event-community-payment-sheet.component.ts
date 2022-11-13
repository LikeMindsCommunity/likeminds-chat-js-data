import { ChangeDetectorRef, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import {UtilsService} from 'src/app/core/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { EventCommunityPaymentComponent } from '../event-community-payment/event-community-payment.component';
import { SubscriptionService } from 'src/app/core/services/subscription.service';

@Component({
  selector: 'app-event-community-payment-sheet',
  templateUrl: './event-community-payment-sheet.component.html',
  styleUrls: ['./event-community-payment-sheet.component.scss']
})
export class EventCommunityPaymentSheetComponent implements OnInit, OnChanges {

  event_cost ;
  communityPlanObj;
  showPlansDropDown : boolean = false;
  selectedCommunityPlan;
  user;
  eventId;
  totalCost;
  eventIsChecked : boolean = true;
  communityIsChecked : boolean = true;
  chatroomId : string;
  distanceToTop;
  community;
  checkBoxClicked;
  screenType;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    private router : Router,
    private localStorageService : LocalStorageService,
    private utilsService : UtilsService,
    private dialog: MatDialog,
    public subscriptionService : SubscriptionService,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscriptionService.broadcastSubscriptionPlans$$.subscribe(res=>{
      if(res) {
        this.communityPlanObj = res;
        this.selectedCommunityPlan = this.communityPlanObj?.plans[0];
        this.handleTotalCost();
        this.cdr.detectChanges();
      }
     
    })
    this.event_cost = this.data?.eventCost?.event_cost;
    this.communityPlanObj = this?.data?.communityPlanObj;
    this.selectedCommunityPlan = this.communityPlanObj?.plans[0];
    this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    this.eventId = this.data?.eventCost?.event_plan_id;
    this.chatroomId = this.data?.chatroomId;
    this.community = this.data?.community;
    this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
    this.handleTotalCost();
  }

  ngOnChanges(changes : SimpleChanges){

  }

  handleCheckBox() : boolean{
    if(this.checkBoxClicked){
      this.checkBoxClicked = false;
      return false;
    }
    else return this.data?.isCheckable
  }

  openOffers(){
    console.log("knock knock ....")
    this.checkBoxClicked = true;

    if(this.screenType == 'mobile'){
      const dialog = this.dialog.open(EventCommunityPaymentComponent
          , {
          data : 'show-offers',
          panelClass : "overflow-modal"
          }    
      );
      dialog.afterClosed().subscribe((response) => {});
      this.utilsService.closeMatDialogBox$$.subscribe(res=>{
        console.log("called>>>>>>>>>", res);
        if(res){
          dialog.close();
          this.utilsService.closeMatDialogBox$$.next(false);
        }
      })
    }
  }


  changeSelectedPlan(i){
    this.selectedCommunityPlan = this.communityPlanObj?.plans[i];
    this.showPlansDropDown = false;
    this.handleTotalCost();
  }

  handleEventCheckbox(event){
    this.eventIsChecked = event?.target?.checked;
    this.handleTotalCost();
  }

  handleCommunityCheckbox(event){
    this.communityIsChecked = event?.target?.checked;
    this.handleTotalCost();
  }

  handleTotalCost(){
    if(this.communityIsChecked && this.eventIsChecked){
      this.totalCost = this.selectedCommunityPlan?.cost + this.event_cost;
      if(this.event_cost == 'FREE'){
        this.totalCost = this.selectedCommunityPlan?.cost;
      }
    }

    else if(!this.communityIsChecked && this.eventIsChecked){
      this.totalCost = this.data?.eventCost?.strike_cost;   
    }

    else if(this.communityIsChecked && !this.eventIsChecked){
      this.totalCost = this.selectedCommunityPlan?.cost;   
      if(this.event_cost == 'FREE'){
        this.totalCost = this.selectedCommunityPlan?.cost;
      }  
    }
    
  }

  showPlans(){
    this.showPlansDropDown = true;
    console.log("not scrolled")
    let planArrow = document.getElementById('plan-arrow');
    this.distanceToTop = planArrow.getBoundingClientRect().top;
    this.distanceToTop = `-${Math.round(this.distanceToTop)-10}px`
  }

  redirectToPaymentPage(){

    if(!this.eventIsChecked && !this.communityIsChecked){
      return;
    }

    else if(this.event_cost=="FREE"){
      if(this.data?.membershipState === 1){
        window.location.href = window.location.origin + "/community_pay?" + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + `&user_id=${this.user?.id}` + '&renew=true' + '&free_event=true' + `&chatroom_id=${this.chatroomId}` ;
      }    
      else if(this.data?.membershipState !== 1){
        window.location.href = window.location.origin + "/community_pay?" + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + `&user_id=${this.user?.id}` + '&free_event=true' + `&chatroom_id=${this.chatroomId}`;
      }
      return;
    }

    else if(this.data?.isCheckable){

      // IF BOTH COMMUNITY AND EVENT ARE CHECKED
      if(this.eventIsChecked && this.communityIsChecked){
        if(this.data?.memberState?.state===0){
          window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + `&user_id=${this.user?.id}` 
        }
    
        else if(this.data?.membershipState === 1){
          window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + '&renew=true' + `&user_id=${this.user?.id}`
        }
      }

      // IF ONLY COMMUNITY IS CHECKED
      else if(!this.eventIsChecked && this.communityIsChecked){
        if(this.data?.memberState?.state===0){
          window.location.href = window.location.origin + "/community_pay?" + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + `&user_id=${this.user?.id}` 
        }
    
        else if(this.data?.membershipState === 1){
          window.location.href = window.location.origin + "/community_pay?" + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + '&renew=true' + `&user_id=${this.user?.id}`
        }
      }

      // IF ONLY EVENT IS CHECKED
      else if(this.eventIsChecked && !this.communityIsChecked){
        if(this.data?.memberState?.state===0){
          window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&user_id=${this.user?.id}` 
        }
    
        else if(this.data?.membershipState === 1){
          window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&user_id=${this.user?.id}` 
        }
      }

    }

    else if(!this.data?.isCheckable){
      if(this.data?.memberState?.state===0){
        window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + `&user_id=${this.user?.id}` 
      }
  
      else if(this.data?.membershipState === 1){
        window.location.href = window.location.origin + "/community_pay?" + `event_plan_id=${this.eventId}` + `&plan_id=${this.selectedCommunityPlan?.plan_id}` + '&renew=true' + `&user_id=${this.user?.id}`
      }
    }
    
  }

}

