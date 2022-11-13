import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { forkJoin, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { ProfileService } from 'src/app/core/services/profile.service';

import { Payload } from 'src/app/shared/models/app.model';
import { IUrlParams } from 'src/app/shared/models/auth.model';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { IUser } from 'src/app/shared/models/user.model';
import { IMember, IMemberProfile, IMemberState } from 'src/app/shared/models/member.model';
import { ICommonCommunitiesModel, ICommunity } from 'src/app/shared/models/community.model';
import { SetHeaderAction, StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { IChatrooms } from 'src/app/shared/models/chatroom.model';
import { ReportMemberPopupComponent } from '../../entryComponents/report-member-popup/report-member-popup.component';
import { ResizeService } from 'src/app/core/services/resize.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { DmService } from 'src/app/core/services/dm.services';
import { ImageCropperComponent } from '../../entryComponents/image-cropper/image-cropper.component';
import { ImageChooserComponent } from '../../entryComponents/image-chooser/image-chooser.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
    CHATROOM_PATH,
    COLLABCARD_PATH,
    COMMUNITY_DETAIL_PATH,
    COMMUNITY_FEED_PATH,
    DIRECT_MESSAGE_PATH,
    PROFILE,
} from 'src/app/shared/constants/routes.constant';
import { ProfileNotAccessiblePopupComponent } from '../../entryComponents/profile-not-accessible-popup/profile-not-accessible-popup.component';
import { ChatroomOptionsSheetComponent } from '../../entryComponents/chatroom-options-sheet/chatroom-options-sheet.component';
import { UpdateProfilePopupComponent } from 'src/app/shared/entryComponents/update-profile-popup/update-profile-popup.component';
import { UpdateProfileSheetComponent } from 'src/app/shared/entryComponents/update-profile-sheet/update-profile-sheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JoinCommunitySheetComponent } from 'src/app/shared/entryComponents/join-community-sheet/join-community-sheet.component';
import { JoinCommunityPopupComponent } from 'src/app/shared/entryComponents/join-community-popup/join-community-popup.component';
import { IQuestion } from 'src/app/shared/models/question.model';
import { QUESTION_STATE } from 'src/app/shared/enums/questions-state.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL, SOURCE } from 'src/app/shared/enums/mixpanel.enum';
import { RemoveProfileComponent } from '../../entryComponents/remove-profile/remove-profile.component';
// import { LimitExceedDialogComponent } from 'src/app/pages/dm-feed/components/limit-exceed-dialog/limit-exceed-dialog.component';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
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
    user: IUser;
    communityId: string;
    community: ICommunity;
    admins: IMember[];
    userId: string;
    urlParams: IUrlParams;
    memberProfile: IMemberProfile;
    memberState: IMemberState;
    destroy$$ = new Subject();
    member_since: string;
    common_communities: ICommonCommunitiesModel;
    communityPageNo: number = 1;
    remainingCommunitiesCount: number = 0;
    chatrooms: IChatrooms;
    chatroomPageNo: number = 1;
    remainingChatroomsCount: number = 0;
    chatroomsState: number = 0;
    stateChanged: boolean = false;
    showButton: boolean = true;
    screenType: string;
    buttonText: string = 'Chat rooms created';
    selfProfile: boolean = false;
    showReportPage: boolean = false;
    showImageCropper: boolean = false;
    showImageCropperEvent: any;
    questions: IQuestion[];
    showFullAbout: boolean = false;
    maxCharLength: number = 350;
    canReport: boolean = false;
    image_source: string;
    communitId: any;
    showDm: boolean = false;
    dmPageUrl: string = `${DIRECT_MESSAGE_PATH}`;
    userRightsData: any;
    show_dm: boolean = false;
    currentCommunityData: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private router: Router,
        private store: Store<State>,
        private localStorageService: LocalStorageService,
        private activatedRoute: ActivatedRoute,
        private profileService: ProfileService,
        private communityService: CommunityService,
        private dmService: DmService,
        private dialog: MatDialog,
        private sheet: MatBottomSheet,
        private resizeService: ResizeService,
        private snackbar: MatSnackBar,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.userRightsData = this.localStorageService.getSavedState(STORAGE_KEY.PROFILE_RIGHTS_URL);

        this.communitId = this.userRightsData?.communityId;
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.subscribe((size) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        (this.communityId = this.activatedRoute.snapshot.params.communityId), (this.userId = this.activatedRoute.snapshot.params.userId);
        this.urlParams = this.activatedRoute.snapshot.queryParams;
        this.common_communities = { communities: [], total_count: 0 };
        this.chatrooms = { chatrooms: [], total_chatrooms_created: undefined, total_chatrooms_followed: undefined };

        if (!this.user) this.router.navigate([`${COMMUNITY_DETAIL_PATH}/${this.communityId}`]);
        else this.store.dispatch(StartLoading());

        this.dmService.canDM({ req_from: 'member_profile', member_id: this.userId, community_id: this.communitId }).subscribe((res) => {
            this.show_dm = res?.show_dm;
        });

        let communityDetails = this.communityService.getCommunityDetails({ communityId: this.communityId, memberId: this.userId });
        let adminsList = this.communityService.getCommunityAdminList({ community_id: this.communityId });
        let communityQuestions = this.communityService.getQuestions({ community_id: this.communityId, ...this.urlParams });
        let memberProfile = this.profileService.getMemberProfile(this.communityId, this.userId, this.urlParams);
        const params = {
            community_id: this.communityId,
            from: 'member_profile',
            member_id: this.userId,
        };
        let showDmInfo = this.dmService.getShowDmButtonInfo(params);
        forkJoin([communityDetails, adminsList, communityQuestions, memberProfile, showDmInfo]).subscribe((results) => {
            this.community = results[0].community;
            this.admins = results[1].members;
            this.questions = results[2].questions;
            this.memberProfile = results[3];
            if (results[4]?.success) {
                this.showDm = results[4]?.show_dm;
                if (results[4]?.cta) {
                    const searchUrl = `?${results[4]?.cta.split('?')[1]}`;
                    const urlParams = new URLSearchParams(searchUrl);
                    const chatRoomId = urlParams.get('chatroom_id');
                    const communityId = urlParams.get('community_id');
                    if (chatRoomId && communityId) {
                        this.dmPageUrl = `/${DIRECT_MESSAGE_PATH}/${communityId}/${COLLABCARD_PATH}/${chatRoomId}`;
                    } else {
                        this.dmPageUrl = `/${DIRECT_MESSAGE_PATH}/${this.communitId}`;
                    }
                } else {
                    this.dmPageUrl = `/${DIRECT_MESSAGE_PATH}/${this.communitId}`;
                }
            }
            this.handleUserState();
            this.setHeader();
            this.getCommonCommunities();
            this.getUserChatrooms();
            this.store.dispatch(StopLoading());
            this.communityService.currentCommunityData$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
                if (res) {
                    this.currentCommunityData = res;
                }
            });
        });
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

    handleUserState() {
        this.communityService.getMemberState({ community_id: this.communityId, member_id: this.user.id }).subscribe((response) => {
            this.memberState = response;
            if (!this.memberState?.manager_rights || this.memberState?.manager_rights.find((item) => item.state === 1) === undefined)
                this.canReport = true;
            if (this.memberState.state === 3) this.openMemberProfileNotAccessiblePopup();
            if (this.memberState.state === 9) this.openUpdateProfileCard();
            if (this.memberState.state === 0) this.handleNonMember();
            if ([1, 4].includes(this.memberState.state)) this.handleMember();
        });
    }

    removeCommunityMember(user: any, page) {
        if (page === 'remove') {
            this.dialog.open(RemoveProfileComponent, {
                data: {
                    user: user,
                    community_id: this.communitId,
                },
                disableClose: true,
            });
        } else {
            const redirectURL = `/${COMMUNITY_FEED_PATH}/${this.communitId}/edit_manager_rights?community_id=${this.communitId}&member_id=${this.userRightsData.userObject.id}`;
            this.router.navigateByUrl(redirectURL);
        }
    }

    openMemberProfileNotAccessiblePopup() {
        this.dialog.open(ProfileNotAccessiblePopupComponent, {
            data: {
                isDesktop: this.screenType === 'desktop',
                community_id: this.communityId,
            },
            disableClose: true,
            backdropClass: 'notVisibleBackdrop',
        });
    }

    openDmFeed() {
        this.dmService.requestDMLimit({ member_id: this.userId, community_id: this.currentCommunityData.id }).subscribe((res) => {
            if (res?.success) {
                if (res?.is_request_dm_limit_exceeded) {
                    // this.dialog.open(LimitExceedDialogComponent, { data: res?.new_request_dm_timestamp })
                } else {
                    if (res?.chatroom_id) {
                        this.router.navigateByUrl(
                            `${DIRECT_MESSAGE_PATH}/${this.currentCommunityData.id}/${COLLABCARD_PATH}/${res?.chatroom_id}`
                        );
                    } else {
                        this.dmService.createDM({ community_id: this.communitId, member_id: this.userId }).subscribe((res) => {
                            if (res?.success) {
                                this.localStorageService.setSavedState(res?.chatroom_local, STORAGE_KEY.CHATROOM_LOCAL);
                                this.router.navigateByUrl(
                                    `${DIRECT_MESSAGE_PATH}/${this.currentCommunityData.id}/${COLLABCARD_PATH}/${res?.chatroom.id}`
                                );
                            } else {
                                this.snackbar.open(res?.error_message, null, { duration: 3000 });
                            }
                        });
                    }
                }
            } else {
                this.snackbar.open(res?.error_message, null, { duration: 3000 });
            }
        });
    }

    openUpdateProfileCard() {
        if (this.screenType != 'mobile')
            this.dialog.open(UpdateProfilePopupComponent, {
                data: {
                    user: this.user,
                    community_id: this.communityId,
                },
                backdropClass: 'notVisibleBackdrop',
            });

        if (this.screenType === 'mobile')
            this.sheet.open(UpdateProfileSheetComponent, {
                data: {
                    user: this.user,
                    community_id: this.communityId,
                },
                backdropClass: 'notVisibleBackdrop',
            });
    }

    handleNonMember() {
        if (this.screenType === 'mobile')
            this.sheet
                .open(JoinCommunitySheetComponent, {
                    data: {
                        memberState: this.memberState,
                        user: this.user,
                        community: this.community,
                        admins: this.admins,
                    },
                    backdropClass: 'notVisibleBackdrop',
                    disableClose: true,
                })
                .afterDismissed()
                .subscribe((response) => {
                    if (response) this.router.navigateByUrl(response);
                });

        if (this.screenType != 'mobile')
            this.dialog
                .open(JoinCommunityPopupComponent, {
                    data: {
                        memberState: this.memberState,
                        user: this.user,
                        community: this.community,
                        admins: this.admins,
                    },
                    backdropClass: 'notVisibleBackdrop',
                    disableClose: true,
                })
                .afterClosed()
                .subscribe((response) => {
                    if (response) this.router.navigateByUrl(response);
                });
    }

    handleMember() {
        if (parseInt(this.userId) === this.user.id) this.selfProfile = true;
        else this.selfProfile = false;
    }

    setHeader() {
        this.member_since = this.memberProfile.member_since ? this.memberProfile?.member_since.split('since ')[1] : '';
        this.store.dispatch(
            SetHeaderAction(
                new Payload({
                    back: true,
                    backLink: `/community_detail/${this.memberProfile?.community_id}`,
                    background: 'bg-theme1',
                    color: 'F',
                    showLogo: false,
                    showDownloadLink: true,
                    isChatroom: false,
                    title: this.memberProfile?.name,
                })
            )
        );
    }

    getCommonCommunities() {
        this.store.dispatch(StartLoading());
        this.profileService.getCommonCommunities(this.userId, this.communityPageNo, this.urlParams).subscribe(
            (response) => {
                this.common_communities.communities = [...this.common_communities.communities, ...response.communities];
                this.common_communities.total_count = response.total_count;
                this.remainingCommunitiesCount = this.common_communities?.total_count - 10 * this.communityPageNo;
                this.store.dispatch(StopLoading());
            },
            (error) => {
                this.common_communities.communities = [];
                this.common_communities.total_count = 0;
                this.store.dispatch(StopLoading());
            }
        );
    }

    getMoreCommunities() {
        this.communityPageNo += 1;
        this.getCommonCommunities();
    }

    getUserChatrooms() {
        this.store.dispatch(StartLoading());
        this.profileService.getChatrooms(this.communityId, this.userId, this.chatroomsState, this.chatroomPageNo, this.urlParams).subscribe(
            (response) => {
                if (this.stateChanged) {
                    this.chatrooms = response;
                    this.stateChanged = false;
                } else {
                    this.chatrooms.chatrooms = [...this.chatrooms.chatrooms, ...response.chatrooms];
                    if (response?.total_chatrooms_created) this.chatrooms.total_chatrooms_created = response.total_chatrooms_created;
                    else this.chatrooms.total_chatrooms_followed = response.total_chatrooms_followed;
                }

                if (this.chatrooms?.total_chatrooms_created)
                    this.remainingChatroomsCount = this.chatrooms?.total_chatrooms_created - 10 * this.chatroomPageNo;
                else this.remainingChatroomsCount = this.chatrooms?.total_chatrooms_followed - 10 * this.chatroomPageNo;
                this.store.dispatch(StopLoading());
            },
            (error) => {
                this.chatrooms.chatrooms = [];
                this.chatrooms.total_chatrooms_created = 0;
                this.chatrooms.total_chatrooms_followed = 0;
                this.store.dispatch(StopLoading());
            }
        );
    }

    getMoreChatrooms() {
        this.chatroomPageNo += 1;
        this.getUserChatrooms();
    }

    showDropdown() {
        this.showButton = true;
    }

    showChatroomOptionSheet(buttonText: string) {
        let value: number;
        if (buttonText === 'Chat rooms created') value = 0;
        else if (buttonText === 'Chat rooms followed') value = 1;
        this.sheet.open(ChatroomOptionsSheetComponent, {
            data: {
                value: value,
                changeOptionfunction: this.updateChatroomsSection,
            },
        });
    }

    updateChatroomsSection = (type: number) => {
        if (![0, 1].includes(type)) return;
        if (this.chatroomsState === type) this.showButton = true;
        else {
            this.stateChanged = true;
            this.chatroomsState = type;
            this.chatroomPageNo = 1;
            if (type === 0) {
                this.buttonText = 'Chat rooms created';
                this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_CHATROOM_CREATED, {
                    community_id: this.memberProfile.community_id,
                    viewed_member_id: this.memberProfile.id,
                    viewed_member_state: this.memberProfile.state,
                });
            } else {
                this.buttonText = 'Chat rooms followed';
                this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_CHATROOM_FOLLOWED, {
                    community_id: this.memberProfile.community_id,
                    viewed_member_id: this.memberProfile.id,
                    viewed_member_state: this.memberProfile.state,
                });
            }
            this.showButton = true;
            this.getUserChatrooms();
        }
    };

    OpenReportMemberPopup() {
        this.store.dispatch(StartLoading());
        this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_REPORT, {
            community_id: this.memberProfile.community_id,
            viewed_member_id: this.memberProfile.id,
            viewed_member_state: this.memberProfile.state,
        });
        if (this.screenType != 'mobile') {
            this.dialog.open(ReportMemberPopupComponent, {
                data: {
                    member_id: this.userId,
                    community_id: this.communityId,
                    viewed_member_state: this.memberProfile.state,
                },
            });
        } else {
            this.showReportPage = true;
        }
    }

    openImageChooser() {
        this.sheet
            .open(ImageChooserComponent, {
                data: {
                    community_id: this.communityId,
                    member_id: this.user.id,
                },
                disableClose: true,
            })
            .afterDismissed()
            .subscribe((response) => {
                if (response) {
                    this.showImageCropperEvent = response.event;
                    this.image_source = response.image_source;
                    this.showImageCropper = true;
                }
            });
    }

    closeCropper(event) {
        this.showImageCropperEvent = '';
        this.showImageCropper = false;
    }

    uploadImage(event) {
        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

        this.dialog
            .open(ImageCropperComponent, {
                data: {
                    community_id: this.communityId,
                    member_id: this.user.id,
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
        let questions = this.parseQuestion(this.questions);
        let data = {
            community_id: this.communityId,
            image_url: event,
            timestamp: moment().valueOf(),
            questions: questions,
        };
        this.profileService.editMemberProfile(data).subscribe(
            (response) => {
                if (response.success)
                    this.profileService.getMemberProfile(this.communityId, this.userId, this.urlParams).subscribe(
                        (anotherresponse) => {
                            this.memberProfile = anotherresponse;
                            this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_PICTURE_UPLOAD, {
                                community_id: this.memberProfile.community_id,
                                member_state: this.memberProfile.state,
                                source: SOURCE.MEMBER_PROFILE_PAGE,
                                via: this.image_source,
                            });
                            this.store.dispatch(StopLoading());
                        },
                        (error) => {
                            this.store.dispatch(StopLoading());
                        }
                    );
                else {
                    this.snackbar.open(`Error updating profile.`, undefined, {
                        duration: 3000,
                        panelClass: ['snackbar'],
                    });
                }
            },
            (error) => {
                this.snackbar.open(`Error updating profile.`, undefined, {
                    duration: 3000,
                    panelClass: ['snackbar'],
                });
            }
        );
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

    closeReport() {
        this.showReportPage = false;
    }

    openChatroom(id: number) {
        this.router.navigate([`${CHATROOM_PATH}/${id}`]);
    }

    openCommunity(id: number) {
        this.router.navigate([`${COMMUNITY_DETAIL_PATH}/${id}`]);
    }

    openEditProfile() {
        this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_EDIT, {
            community_id: this.communityId,
            member_state: this.memberState?.state,
            source: SOURCE.MEMBER_PROFILE_PAGE,
        });
        this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.communityId}/${PROFILE}/${this.user.id}/edit`]);
    }

    parseQuestion(questions: IQuestion[]) {
        let result = questions.slice().sort((a: IQuestion, b: IQuestion) => (a.rank > b.rank ? 1 : b.rank > a.rank ? -1 : 0));
        return result.reduce((items, { id, question_title, state, value, optional, help_text, field }, index) => {
            let parsedOptions: any;
            if (value)
                parsedOptions =
                    ![QUESTION_STATE.CHOICE_SINGLE, QUESTION_STATE.CHOICE_MULTIPLE].includes(state) && value
                        ? JSON.parse(value)[0]
                        : JSON.parse(value);
            if (this.memberState?.member?.question_answers)
                items.push({
                    id,
                    question_title,
                    state,
                    optional,
                    options: parsedOptions,
                    value: this.getQuestionValue(id),
                    help_text,
                    field,
                });
            else items.push({ id, question_title, state, optional, options: parsedOptions, value: null, help_text, field });
            return items;
        }, []);
    }

    getQuestionValue(id: number) {
        let question = this.memberState?.member?.question_answers.filter((item) => item.question_id === id);
        if (question?.length) return question[0]?.value;
        else return null;
    }

    changeShowFullAbout(value: boolean) {
        this.showFullAbout = value;
    }

    infoClicked(infoObj: any) {
        this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_QUESTION_CLICKED, {
            community_id: this.memberProfile.community_id,
            viewed_member_id: this.memberProfile.id,
            viewed_member_state: this.memberProfile.state,
            question_state: infoObj.state,
            question_title: infoObj.question_title,
        });
    }
}
