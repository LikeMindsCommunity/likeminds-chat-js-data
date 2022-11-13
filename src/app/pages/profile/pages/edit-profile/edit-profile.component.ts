import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { Subject } from 'rxjs';
import { getMessage } from 'src/app/shared/store/selectors/app.selector';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

import { Payload } from 'src/app/shared/models/app.model';
import { IUrlParams } from 'src/app/shared/models/auth.model';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { IUser } from 'src/app/shared/models/user.model';
import { SetHeaderAction, StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { ProfileService } from 'src/app/core/services/profile.service';
import { IMemberState } from 'src/app/shared/models/member.model';
import { IQuestion } from 'src/app/shared/models/question.model';
import { CommunityService } from 'src/app/core/services/community.service';
import { QUESTION_STATE } from 'src/app/shared/enums/questions-state.enum';
import { ResizeService } from 'src/app/core/services/resize.service';
import { COMMUNITY_DETAIL_PATH, COMMUNITY_FEED_PATH, PROFILE } from 'src/app/shared/constants/routes.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ImageCropperComponent } from '../../entryComponents/image-cropper/image-cropper.component';
import { ImageChooserComponent } from '../../entryComponents/image-chooser/image-chooser.component';
import { GetIntroExamplesAction } from 'src/app/shared/store/actions/community.action';
import { MIXPANEL, SOURCE } from 'src/app/shared/enums/mixpanel.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: IUser;
  communityId: string;
  userId: string;
  urlParams: IUrlParams;
  memberState: IMemberState;
  questions: IQuestion[];
  screenType: string;
  isMobileScreen = false;
  message: string;
  questionAnswers: any[] = [];
  validity = [];
  formEdited = true;
  formSubmitted: boolean;
  destroy$$ = new Subject();
  showImageCropper: boolean = false;
  showImageCropperEvent: any;
  image_source: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private communityService: CommunityService,
    private resizeService: ResizeService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private sheet: MatBottomSheet,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
      if (this.screenType === 'mobile') this.isMobileScreen = true;
    }
    this.resizeService.onResize$.subscribe(size => {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : (window.innerWidth <= 768 ? 'tab' : 'desktop');
        if (this.screenType === 'mobile') this.isMobileScreen = true;
        else this.isMobileScreen = false;
    });
    this.store.pipe(select(getMessage)).subscribe((message: any) => {if (message) this.message = message;});
    this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    this.communityId = this.activatedRoute.snapshot.params.communityId,
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.urlParams = this.activatedRoute.snapshot.queryParams;
    this.store.dispatch(GetIntroExamplesAction());
    this.store.dispatch(StartLoading());
    this.getMemberState();
    this.getQuestions();
  }

  getMemberState() {
    let params = {community_id: this.communityId, member_id: this.userId, ...this.urlParams};
    this.communityService.getMemberState(params).subscribe(response => {
      this.memberState = response;

      if (this.memberState.state === 0) this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${this.communityId}`]);

      this.store.dispatch(SetHeaderAction(new Payload({
        back: true,
        backLink: `/community_detail/${response.community_id}`,
        background: "bg-theme1",
        color: "F",
        showLogo: true,
        showDownloadLink: true,
        isChatroom: false,
        title: response && response.name,
      })));
    }, error => {
      
    });
  };

  getQuestions() {
    let params = {community_id: this.communityId, ...this.urlParams}
    this.communityService.getQuestions(params).subscribe(response => {
      this.questions = response.questions && this.parseQuestion(response.questions);
      this.store.dispatch(StopLoading());
    }, error => {
      this.questions = [];
      this.store.dispatch(StopLoading());
    })
  }

  parseQuestion(questions: IQuestion[]) {
      let result = questions.slice().sort((a: IQuestion, b: IQuestion) => a.rank > b.rank ? 1 : (b.rank > a.rank ? -1 : 0));
      return result.reduce((items, { id, question_title, state, value, optional, help_text, field }, index) => {
          if (state === QUESTION_STATE.MOBILE_NO) this.setValidity({ index, value: true });
          else this.setValidity({ index, value: false });
          let parsedOptions: any
          if (value) parsedOptions = ![QUESTION_STATE.CHOICE_SINGLE, QUESTION_STATE.CHOICE_MULTIPLE].includes(state) && value
              ? JSON.parse(value)[0] : JSON.parse(value);
          if (this.memberState?.member?.question_answers) items.push({ id, question_title, state, optional, options: parsedOptions, value: this.getQuestionValue(id), help_text, field });
          else items.push({ id, question_title, state, optional, options: parsedOptions, value: null, help_text, field });
          return items;
      }, []);
  }

  getQuestionValue(id: number) {
    if (this.memberState?.member?.question_answers) {
      let question = this.memberState?.member?.question_answers.filter(item => item.question_id === id);
      if (question?.length) return question[0]?.value;
      else return null;
    }
    else return null;
  }

  setFieldValidity(index, value) {
      this.setValidity({ index, value });
  }

  setFieldValue(index, value) {
      if (!this.formEdited) this.formEdited = true;
      this.questions[index].value = value;
  }

  setValidity({ index, value }) {
      this.validity[index] = value;
  }

  openImageChooser() {
    this.sheet.open(ImageChooserComponent, {
      data: {
        community_id: this.communityId,
        member_id: this.user.id
      },
      disableClose: true
    })
    .afterDismissed().subscribe(response => {
      this.showImageCropperEvent = response.event;
      this.image_source = response.image_source;
      this.showImageCropper = true;
    });
  }

  closeCropper(event) {
    this.showImageCropperEvent = '';
    this.showImageCropper = false;
  }

  uploadImage(event) {
    if (this.checkIfErrorInFiles(event.target.files)) { return; }
    
    this.dialog.open(ImageCropperComponent, {
      data: {
        community_id: this.communityId,
        member_id: this.user.id,
        event: event
      }
    })
    .afterClosed().subscribe(response => {
      this.image_source = 'gallery';
      this.updateProfile(response);
    });;
  }

  checkIfErrorInFiles(files): boolean {
    const fileArray: any[] = Array.from(files);
    if (fileArray.find(file => file.size > MAX_FILE_SIZE_BYTES)) {
        this.snackbar.open(`Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS}Mbs.`, undefined, {
          panelClass: ['snackbar'],
          duration: 3000
        });
        return true;
    }
    return false;
  }

  handleSubmit() {
    this.formSubmitted = true;
    if (!this.questions.length || !this.formValid) return;
    
    const questions = this.questions.map(({ id, question_title, state, value, optional, help_text, field }) =>
            ({ id, question_title, state, value, optional, help_text, field }));

    let editedQuestionsList = [];
    for (let question of questions) {
      if (question.value != this.getQuestionValue(question.id)) {
        editedQuestionsList.push(question.state);
      }
    }

    const data = {
      community_id: this.communityId,
      questions: questions,
      timestamp: moment().valueOf()
    };

    this.profileService.editMemberProfile(data).subscribe(response => {
      if (response.success) {
        this.analyticsService.sendEvent(
          MIXPANEL.MEMBER_PROFILE_UPDATED, {
            community_id: this.communityId,
            member_state: this.memberState.state,
            source: SOURCE.MEMBER_PROFILE_PAGE,
            update: 'about',
            question_type: editedQuestionsList
          });
        this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.communityId}/${PROFILE}/${this.user.id}`])
        this.snackbar.open(`You community profile is updated successfully.`, undefined, {
          duration: 3000,
          panelClass: ['snackbar']
        });
      } else {
        this.snackbar.open(`Error updating profile.`, undefined, {
          duration: 3000,
          panelClass: ['snackbar']
        });
      }
    }, error => {
      this.snackbar.open(`Error updating profile.`, undefined, {
        duration: 3000,
        panelClass: ['snackbar']
      });
    })
  }

  updateProfile(event) {
    const questions = this.questions.map(({ id, question_title, state, value, optional, help_text, field }) =>
            ({ id, question_title, state, value, optional, help_text, field }));

    let data = {
      community_id: this.communityId,
      image_url: event,
      timestamp: moment().valueOf(),
      questions: questions
    }
    this.profileService.editMemberProfile(data).subscribe(response => {
      if (response.success) {
        this.analyticsService.sendEvent(
          MIXPANEL.MEMBER_PROFILE_PICTURE_UPLOAD, {
            community_id: this.communityId,
            member_state: this.memberState.state,
            source: SOURCE.MEMBER_PROFILE_PAGE,
            via: this.image_source
          });
        this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.communityId}/${PROFILE}/${this.user.id}`]);
      }
      else {
        this.snackbar.open(`Error updating profile.`, undefined, {
          duration: 3000,
          panelClass: ['snackbar']
        });
      }
    }, error => {
      this.snackbar.open(`Error updating profile.`, undefined, {
        duration: 3000,
        panelClass: ['snackbar']
      });
    })
  }

  get formValid(): boolean {
    return this.validity.includes(false) ? false : true;
  }

}
