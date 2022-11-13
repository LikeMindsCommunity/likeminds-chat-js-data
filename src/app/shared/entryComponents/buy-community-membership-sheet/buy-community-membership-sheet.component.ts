import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CommunityService } from 'src/app/core/services/community.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import {UtilsService} from 'src/app/core/services/utils.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { Router } from '@angular/router';
import { ChatroomService } from 'src/app/core/services/chatroom.service';

@Component({
  selector: 'app-buy-community-membership-sheet',
  templateUrl: './buy-community-membership-sheet.component.html',
  styleUrls: ['./buy-community-membership-sheet.component.scss']
})
export class BuyCommunityMembershipSheetComponent implements OnInit {

  communityId
  community
  memberState;
  subscribedCommunity;
  membershipState;
  buyMembershipUrl;
  chatroom_type;
  admins : any = null;
  user;
  accessibleWithoutSubscription: boolean = false;
  showExpiredMembershipMessage: boolean = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data,
    private communityService : CommunityService,
    private locatStorageService : LocalStorageService,
    private router : Router,
    private utilsService : UtilsService,
    private chatroomService : ChatroomService
  ) { }

  ngOnInit(): void {
      this.community = this.data?.community;
      this.membershipState = this.data?.membershipState;
      this.buyMembershipUrl = this.data?.buyMembershipUrl;
      this.chatroom_type = this.data?.chatroom_type;
      this.admins = this.data?.admins
      this.user = this.locatStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER)
      if(!this.admins) this.getCommunityAdmins(this.community?.id);   
  
      this.chatroomService.accessibleWithoutSubscription$$.subscribe(res=>{
        this.accessibleWithoutSubscription = res;
      })

      if(this.data?.showExpiredMembershipMessage == 'showExpiredMembershipMessage'){
        this.showExpiredMembershipMessage = true;
      }
    
  }

  getCommunityAdmins(community_id: number | string) {
    this.communityService.getCommunityAdminList({ community_id }).subscribe((response) => {
        this.admins = response.members;
    });    
  }

  hideChatroomDetail(){
    this.utilsService.closeMatBottomSheet$$.next(true);
  }

  openPaymentPage(){
    if(this.buyMembershipUrl.substring(0,8) !== "https://"){
        this.buyMembershipUrl = "https://" + this.buyMembershipUrl;
    }
    window.location.href = this.buyMembershipUrl;
  }

  openRenewal() {
    this.hideChatroomDetail();
  //   this.router.navigate(['/community_feed/' + this.community?.id + '/renewal/' + this.community?.id], {
  //     queryParams: { renew: 'true', user_id: this.user.id },
  // });
    this.router.navigate(['/renewal/' + this.community?.id], { queryParams: { renew: true, user_id: this.user?.id } });
  }

  goToLogin(){    
    this.router.navigate(['/auth']);    
    this.hideChatroomDetail();
  }

}
