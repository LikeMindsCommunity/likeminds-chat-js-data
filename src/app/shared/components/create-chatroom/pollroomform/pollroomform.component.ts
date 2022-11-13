import { Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { CreateChatroomService } from '../../../../core/services/create-chatroom.service';
import { IChatroom } from '../../../models/chatroom.model';
import { ICommunity } from '../../../models/community.model';
import { IUser } from '../../../models/user.model';
import { State } from '../../../../shared/store/reducers';
import { CommunityService } from 'src/app/core/services/community.service';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;

@Component({
    selector: 'app-pollroomform',
    templateUrl: './pollroomform.component.html',
    styleUrls: ['./pollroomform.component.scss', './../create-chatroom.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PollroomformComponent implements OnInit {
    chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() user: IUser;
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    @Output() chatRoomSuccess = new EventEmitter<Object>();

    pollRoomForm: FormGroup;
    submitted = false;
    advanceOptions: boolean = false;
    model: any = {};
    multiSelectOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    minDate = new Date();

    crParams: any;
    is_cm: boolean = false;
    isSecretCR: boolean = false;
    memberList: any;
    memberListObj: any = [];
    memberPage: number = 1;
    stopPagination: boolean = true;
    selectedMemberList: any = [];
    currentCommunityData: any = null;

    constructor(
        private store: Store<State>,
        private createChatroom: CreateChatroomService,
        private fb: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private communityService: CommunityService
    ) {
        // Reactive Form
        this.pollRoomForm = this.fb.group({
            pollQuestion: ['', [Validators.required, Validators.minLength(10)]],
            options: this.fb.array([this.fb.group({ text: '' }), this.fb.group({ text: '' })]),
            expiryDate: ['', [Validators.required]],
            allowAddOption: [false],
            anonymousPoll: [false],
            liveResult: [0],
            multipleSelectState: ['Exactly'],
            multipleSelectNo: [1],
        });
    }

    ngOnInit(): void {
        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== this.currentCommunityData) this.currentCommunityData = data;
        });
    }

    showAdvanceOption() {
        this.advanceOptions = !this.advanceOptions;
    }

    get pollOptions() {
        return this.pollRoomForm.get('options') as FormArray;
    }

    addPollOption() {
        if (this.pollOptions.length < 10) this.pollOptions.push(this.fb.group({ text: '' }));
        else {
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

    // convenience getter for easy access to form fields
    get formObject() {
        return this.pollRoomForm.controls;
    }

    onCreatePollRoom() {
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

    onReset() {
        this.submitted = false;
        this.pollRoomForm.invalid;
        this.pollRoomForm.value.conversationArea = '';
        this.pollRoomForm.value.chatroomName = '';
        this.pollRoomForm.reset();
    }
}
