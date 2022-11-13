import { Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CreateChatroomService } from 'src/app/core/services/create-chatroom.service';
import { IChatroom } from '../../models/chatroom.model';
import { ICommunity } from '../../models/community.model';
import { IUser } from '../../models/user.model';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { State } from '../../../shared/store/reducers';
import * as moment from 'moment';
import { StartLoading, StopLoading } from '../../store/actions/app.action';
import { CommunityService } from 'src/app/core/services/community.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;

@Component({
    selector: 'app-polls-chat-card',
    templateUrl: './polls-chat-card.component.html',
    styleUrls: ['./polls-chat-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PollsChatCardComponent implements OnInit {
    chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() user: IUser;
    @Input() isPollChatRoom;
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    @Output() chatRoomSuccess = new EventEmitter<Object>();

    pollRoomForm: FormGroup;
    submitted = false;
    advanceOptions: boolean = false;
    model: any = {};
    multiSelectOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    minDate = new Date();
    disableSubmitButtonQuesFlag: boolean = true;
    disableSubmitButtonOptionFlag: boolean = true;
    disableSubmitButtonDateFlag: boolean = true;
    duplicateOptions: boolean = false;
    selectedDate: string = '';
    currentCommunityData: any = null;
    guestUser;

    constructor(
        private fb: FormBuilder,
        private localStorageService: LocalStorageService,
        private snackbar: MatSnackBar,
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private router: Router,
        private createChatroom: CreateChatroomService,
        private utilsService: UtilsService,
        private store: Store<State>,
        private communityService: CommunityService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    ngOnInit(): void {
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');
        // Reactive Form
        this.pollRoomForm = this.fb.group({
            pollQuestion: ['', [Validators.required, Validators.minLength(1)]],
            options: this.fb.array([this.fb.group({ text: '' }), this.fb.group({ text: '' })]),
            expiryDate: ['', [Validators.required]],
            allowAddOption: [false],
            anonymousPoll: [false],
            liveResult: [0],
            multipleSelectState: ['Exactly'],
            multipleSelectNo: [1],
        });

        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== this.currentCommunityData) this.currentCommunityData = data;
        });
        this.onChanges();
    }

    onChanges(): void {
        this.pollRoomForm.get('pollQuestion').valueChanges.subscribe((val) => {
            if (val?.length == 0) {
                this.disableSubmitButtonQuesFlag = true;
            } else this.disableSubmitButtonQuesFlag = false;
        });

        let set;
        this.pollRoomForm.get('options').valueChanges.subscribe((options) => {
            // .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            this.duplicateOptions = false;
            let allPollOptions = [];
            for (let option of options) {
                allPollOptions.push(option.text);
                if (option.text.length == 0) {
                    this.disableSubmitButtonOptionFlag = true;
                    return;
                }
            }
            set = new Set(allPollOptions);
            if (set.size < options.length) {
                this.duplicateOptions = true;
            }

            this.disableSubmitButtonOptionFlag = false;
        });

        this.pollRoomForm.get('expiryDate').valueChanges.subscribe((val) => {
            this.selectedDate = moment(val).format('DD-MM-YYYY HH:mm');
            if (val.toString().length == 0) {
                this.disableSubmitButtonDateFlag = true;
            } else {
                //this.pollRoomForm.get('expiryDate').setValue("hehe");
                this.pollRoomForm.get('expiryDate').patchValue(val, { emitEvent: false });
                this.disableSubmitButtonDateFlag = false;
                return;
            }
        });
    }

    showAdvanceOption() {
        if (this.advanceOptions) {
            this.resetAdvancedOptions();
        }
        this.advanceOptions = !this.advanceOptions;
    }

    get pollOptions() {
        return this.pollRoomForm.get('options') as FormArray;
    }

    addPollOption() {
        if (this.pollOptions.length < 10) {
            this.pollOptions.push(this.fb.group({ text: '' }));
        } else {
            this.snackbar.open('A poll cannot have more than 10 voting options', undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
        }
    }

    deletePollOption(index) {
        if (this.pollOptions.length < 3) {
            this.snackbar.open('Minimum two options are mandatory', undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
        } else this.pollOptions.removeAt(index);
    }

    removeDate() {
        this.pollRoomForm.get('expiryDate').setValue('');
    }

    // convenience getter for easy access to form fields
    get formObject() {
        return this.pollRoomForm.controls;
    }

    close() {
        this.utilsService.closeMatDialogBox$$.next(true);
    }

    checkNoOfOptionsSelected() {
        let noOfOptions = this.pollRoomForm.get('options') as FormArray;
        let multipleSelectNo = this.pollRoomForm.get('multipleSelectNo');
        if (noOfOptions.length < Number(multipleSelectNo.value)) {
            return noOfOptions.length;
        } else return false;
    }

    createPoll() {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }

        if (this.isPollChatRoom) {
            this.onCreatePollRoom();
        } else this.onCreateMicroPoll();
    }

    //// CREATE POLL ROOM ////

    onCreatePollRoom() {
        let NoOfOptions = this.checkNoOfOptionsSelected();
        let pollTime = this.pollRoomForm.get('expiryDate').value;
        let currentTime = new Date();
        if (currentTime.getTime() > pollTime.getTime()) {
            this.snackbar.open(`Please select future date as poll expire time`, undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        if (NoOfOptions) {
            this.snackbar.open(`You can select at max ${NoOfOptions} options`, undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        if (this.duplicateOptions) {
            this.snackbar.open('Duplicate poll options', undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        this.submitted = true;
        this.close();

        this.submitted = true;
        // stop here if form is invalid
        if (this.pollRoomForm.invalid) {
            return;
        }

        let params = {
            community_id: this.community.id,
            title: this.pollRoomForm.value.pollQuestion,
            header: this.pollRoomForm.value.pollQuestion, // chatroom name
            expiry_time: new Date(this.pollRoomForm.value.expiryDate).getTime(),
            poll_type: this.pollRoomForm.value.liveResult,
            is_anonymous: this.pollRoomForm.value.anonymousPoll,
            allow_add_option: this.pollRoomForm.value.allowAddOption,
            polls: this.pollRoomForm.value.options,
        };

        if (this.pollRoomForm.value.multipleSelectState) {
            switch (this.pollRoomForm.value.multipleSelectState) {
                case 'Exactly':
                    params['multiple_select_state'] = 0;
                    break;
                case 'At Most':
                    params['multiple_select_state'] = 1;
                    break;
                case 'At Least':
                    params['multiple_select_state'] = 2;
                    break;
                default:
                    params['multiple_select_state'] = 0;
                    break;
            }
        }
        if (this.pollRoomForm.value.multipleSelectState) params['multiple_select_no'] = this.pollRoomForm.value.multipleSelectNo;

        this.store.dispatch(StartLoading());
        this.createChatroom.pollRoom(params).subscribe((resData) => {
            this.onReset(); /* Form Reset */
            this.chatRoomSuccess.emit('created');
            this.store.dispatch(StopLoading());
            this.router.navigate([`/${this.currentCommunityData?.id}/collabcard/${resData.collabcard.id}`], {
                queryParams: { newroom: 'tagmembers', roomtype: 'poll' },
            });
        });
    }

    //// CREATE MICRO POLL ////

    onCreateMicroPoll() {
        let NoOfOptions = this.checkNoOfOptionsSelected();
        let pollTime = this.pollRoomForm.get('expiryDate').value;
        let currentTime = new Date();
        if (currentTime.getTime() > pollTime.getTime()) {
            this.snackbar.open(`Please select future date as poll expire time`, undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        if (NoOfOptions) {
            this.snackbar.open(`You can select at max ${NoOfOptions} options`, undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        if (this.duplicateOptions) {
            this.snackbar.open('Duplicate poll options', undefined, {
                panelClass: ['snackbar'],
                duration: 2000,
            });
            return;
        }

        this.submitted = true;
        this.close();
        this.chatroomService.scrollToBottom$$.next(true);

        // stop here if form is invalid
        if (this.pollRoomForm.invalid) {
            return;
        }

        let messageId = new Date().getTime();

        let params = {
            chatroom_id: this.data?.chatroom?.id,
            text: this.pollRoomForm.value.pollQuestion,
            expiry_time: new Date(this.pollRoomForm.value.expiryDate).getTime(),
            poll_type: this.pollRoomForm.value.liveResult,
            is_anonymous: this.pollRoomForm.value.anonymousPoll,
            allow_add_option: this.pollRoomForm.value.allowAddOption,
            polls: this.pollRoomForm.value.options,
            state: 10,
            community_id: this.data?.community?.id,
            id: messageId,
        };

        if (this.pollRoomForm.value.multipleSelectState) {
            switch (this.pollRoomForm.value.multipleSelectState) {
                case 'Exactly':
                    params['multiple_select_state'] = 0;
                    break;
                case 'At Most':
                    params['multiple_select_state'] = 1;
                    break;
                case 'At Least':
                    params['multiple_select_state'] = 2;
                    break;
                default:
                    params['multiple_select_state'] = 0;
                    break;
            }
        }
        if (this.pollRoomForm.value.multipleSelectState) params['multiple_select_no'] = this.pollRoomForm.value.multipleSelectNo;

        params['member'] = this.data?.user;
        let tempParams = {
            ...params,
            created_epoch: messageId,
            date: moment(new Date()).format('DD MMM YYYY'),
            created_at: moment(new Date()).format('HH:mm'),
        };
        this.homeFeedService.updateConversation([tempParams]);
        this.homeFeedService.createMicroPollConversation(params, messageId).subscribe((_) => {});
    }

    onReset() {
        this.submitted = false;
        this.pollRoomForm.invalid;
        this.pollRoomForm.value.conversationArea = '';
        this.pollRoomForm.value.chatroomName = '';
        //this.pollRoomForm.reset();
    }

    resetAdvancedOptions() {
        this.pollRoomForm.patchValue({
            allowAddOption: false,
            anonymousPoll: false,
            liveResult: 0,
            multipleSelectState: '',
            multipleSelectNo: '',
        });
    }
}
