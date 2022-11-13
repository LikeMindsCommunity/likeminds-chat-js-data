import { Component, Output, EventEmitter, Input, OnInit , ViewEncapsulation, Inject } from "@angular/core";
import { environment } from 'src/environments/environment';
import { APPSTORE, PLAYSTORE, IOS, ANDROID } from 'src/app/shared/constants/app-constant';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import {AnalyticsService} from '../../../../app//core/services/analytics.service';
import { CommunityService } from "src/app/core/services/community.service";
import { Router } from "@angular/router";
import { BLOCKER } from "src/app/shared/constants/routes.constant";
import { SubscriptionService } from "src/app/core/services/subscription.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UtilsService } from "src/app/core/services/utils.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.scss']
})
export class ShareUrlComponent {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() closeSheet: EventEmitter<any> = new EventEmitter();
    @Input() isSheet = false;
    @Input() isModal = false;
    toggle1 : boolean = false;
    toggle2 : boolean = false;
    showInfo1 : boolean = false;
    showInfo2 : boolean = false;

    choice = false;
    constructor(
        private analyticsService: AnalyticsService,
        private communityService : CommunityService,
        private router : Router,
        private subscriptionService : SubscriptionService,
        private snackBar : MatSnackBar,
        private utilsService : UtilsService,
        @Inject(MAT_DIALOG_DATA) public user: any,
        ) { }

    close() {
        this.utilsService.closeMatDialogBox$$.next(true);
    }

    openCopiedToClipboard(message , action){
        this.snackBar.open(message , action , {
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: "success-dialog",
            duration: 2000
        })
    }

    copyToClipBoard(val){
        let link ;         
        link = this.user.url.community_share.public_link_text
        this.openCopiedToClipboard("Invite link copied to clipboard" , "OK")

        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = link;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);        
    }

    submit() {
        if (this.isModal) this.closeModal.emit(this.choice);
        if (this.isSheet) this.closeSheet.emit(this.choice);
    }

    clickedRadio(val){
        if(val==0){
            this.toggle1 = true;
            this.toggle2 = false;
            let radio = document.getElementById('radio2') as HTMLInputElement;
            radio.checked = false;
        }
        else if(val == 1){
            this.toggle1 = false;
            this.toggle2 = true;
            let radio = document.getElementById('radio1') as HTMLInputElement;
            radio.checked = false;
        }
    }

    openShareInfo(index){
        if(index == '1'){          
            this.utilsService.closeMatBottomSheet$$.next(1);
        }
        else if(index == '2'){ 
            this.utilsService.closeMatBottomSheet$$.next(2);
        }
    }

    closeShareInfoPopup(){
        this.utilsService.closeMatBottomSheet$$.next(0);
    }
}

