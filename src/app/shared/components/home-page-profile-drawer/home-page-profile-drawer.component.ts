import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { ImageCropperComponent } from '../../entryComponents/image-cropper/image-cropper.component';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { StartLoading, StopLoading } from '../../store/actions/app.action';
import { State } from '../../store/reducers';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;

@Component({
    selector: 'app-home-page-profile-drawer',
    templateUrl: './home-page-profile-drawer.component.html',
    styleUrls: ['./home-page-profile-drawer.component.scss'],
})
export class HomePageProfileDrawerComponent implements OnInit {
    public circleColor: string;
    private colors = [
        '#B71C1C', //red
        '#880E4F', //pink
        '#4A148C', //Purple
        '#311B92', //Deep Purple
        '#1A237E', //Indigo
        '#0D47A1', //Blue
        '#01579B', //Light Blue
        '#006064', //Cyan
        '#004D40', //Teal
        '#1B5E20', //Green
        '#33691E', //Light Green
        '#827717', //Lime
        '#F57F17', //Yellow
        '#FF6F00', //Amber
        '#E65100', //Orange
        '#BF360C', //Deep Orange
        '#3E2723', //Brown
    ];

    imgInitShow: boolean = true;
    imgInit1: any;
    memberProfile: any;
    communityId: string;
    user: any;
    image_source: string;
    private destroy$$ = new Subject();

    constructor(
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private store: Store<State>,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService,
        private authService: AuthService,
        private cookieService: CookieService,
        private activatedRoute: ActivatedRoute,
        private profileService: ProfileService,
        private analyticsService: AnalyticsService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService?.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    }

    /**
     * @function onLogout
     * @param params
     * @description This function is used to logout user
     */
    // onLogout() {
    //     this.homeFeedService.communityGroup$$.next([]);
    //     this.subscriptionService.showMySubscriptions$$.next(false);
    //     this.authService
    //         .logout()
    //         .pipe(takeUntil(this.destroy$$))
    //         .subscribe(
    //             (res) => {
    //                 this.clearLocalData();
    //             },
    //             (err) => {
    //                 this.clearLocalData();
    //             }
    //         );
    // }

    /**
     * @function clearLocalData
     * @param
     * @description This function is used to clear all local, session, cookies storage
     */
    clearLocalData() {
        localStorage.clear();
        sessionStorage.clear();
        // this.cookieService.deleteAll();
        this.router.navigate(['auth']);
        this.hideMediaPopup();
    }

    hideMediaPopup(): void {
        this.chatroomService.closeMediaPopup$$.next(false);
    }

    checkIfErrorInFiles(files): boolean {
        const fileArray: any[] = Array.from(files);
        if (fileArray.find((file) => file.size > MAX_FILE_SIZE_BYTES)) {
            this.snackbar.open(`Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS}Mbs.`, undefined, {
                panelClass: ['snackbar'],
                duration: 3000,
            });
            return true;
        }
        return false;
    }

    closeProfileDrawer() {
        this.chatroomService.openHomePageProfileDrawer$$.next(false);
    }

    onImgError(event, name): void {
        this.imgInit1 = this.userInit(name);
        this.imgInitShow = false;
    }

    userInit(name) {
        this.circleColor = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        let initials = '';
        let namesList = name?.split(' ');
        for (let name of namesList) {
            if (name[0] !== ' ' && name[0]) {
                initials += name[0]?.toUpperCase();
                if (initials.length === 2) break;
            }
        }
        return initials;
    }

    uploadImage(event) {
        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

        this.dialog
            .open(ImageCropperComponent, {
                data: {
                    member_id: this.user?.id,
                    event: event,
                },
            })
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.image_source = 'gallery';
                    this.updateProfile(response);
                }
            });
    }

    updateProfile(event) {
        const payload = new HttpParams().set('type', 'image').set('value', event);

        this.store.dispatch(StartLoading());
        this.profileService
            .updateProfileImage(payload)
            .pipe(takeUntil(this.destroy$$))
            .subscribe(
                (response) => {
                    if (response?.success) {
                        let updatedUser = this.user;
                        updatedUser.image_url = event;
                        this.localStorageService.setSavedState(updatedUser, STORAGE_KEY.LIKEMINDS_USER);
                        this.user = updatedUser;
                        this.homeFeedService?.homePageProfileUpdated$$?.next(true);
                    } else
                        this.snackbar.open(`Error updating profile.`, null, {
                            duration: 3000,
                            panelClass: ['black-bottom-left-snackbar'],
                        });
                    this.store.dispatch(StopLoading());
                },
                (error) => {
                    this.store.dispatch(StopLoading());
                    this.snackbar.open(`Error updating profile.`, null, {
                        duration: 3000,
                        panelClass: ['black-bottom-left-snackbar'],
                    });
                }
            );
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}
