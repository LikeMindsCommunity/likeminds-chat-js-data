import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CommunityService } from 'src/app/core/services/community.service';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { MyChatroom } from '../../../../shared/models/chatroom.model';
import { IUser } from '../../../../shared/models/user.model';

@Component({
    selector: 'app-feed-chatroom-card',
    templateUrl: './feed-chatroom-card.component.html',
    styleUrls: ['./feed-chatroom-card.component.scss'],
    //encapsulation: ViewEncapsulation.None
})
export class FeedChatroomCardComponent implements OnInit {
    @Input() chatroom: MyChatroom;
    @Input() user: IUser;
    @Input() indexOfElement: number;
    @Input() totalChatroomsCount: number;
    imageList: any[] = [];
    deletedMessage: string = '';
    currentCommunityData: any = null;
    collabcardRoute: string = '';

    constructor(private chatRoomService: ChatroomService, private communityService: CommunityService) {}

    ngOnInit(): void {
        this.imageList = [this.chatroom?.chatroom?.member, ...this.chatroom?.conversation_users];
        this.generateDeletedString();
        if (this.chatroom?.last_conversation?.answer) {
            this.chatroom.last_conversation.answer = this.chatroom.last_conversation.answer.replace(
                '\n * This is a gif message. Please update your app *',
                ''
            );
        }
        // this.communityService.currentCommunityData$$.subscribe((data) => {
        //     console.log(this.currentCommunityData);
        //     console.log(data);
        //     if (this.currentCommunityData !== data) {
        //         this.currentCommunityData = data;
        //         this.setCollabcardRoute();
        //     }
        // });

        this.setCollabcardRoute();
    }

    setCollabcardRoute(): void {
        this.collabcardRoute = `/${this.chatroom?.community?.id}/collabcard/${this.chatroom?.chatroom?.id}`;
    }

    // Hiding the media Popup
    hideMediaPopup(): void {
        this.chatRoomService.closeMediaPopup$$.next(false);
    }

    generateDeletedString() {
        if (this.chatroom.last_conversation?.member.id && this.chatroom.last_conversation?.deleted_by) {
            const memberId = this.chatroom.last_conversation.member.id;
            const deletedById = this.chatroom.last_conversation.deleted_by;
            const userId = this.user?.id;
            if (+memberId === +userId) {
                if (+deletedById === +userId) {
                    this.deletedMessage = 'You deleted this message.';
                } else {
                    this.deletedMessage = 'Your message was deleted by a community manager.';
                }
            } else {
                if (+memberId === +deletedById) {
                    this.deletedMessage = 'This message was deleted.';
                } else {
                    this.deletedMessage = 'This message was deleted by a community manager.';
                }
            }
        }
    }
}
