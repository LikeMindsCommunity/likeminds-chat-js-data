import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-reply-preview',
    templateUrl: './reply-preview.component.html',
    styleUrls: ['./reply-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyPreviewComponent implements OnInit, OnChanges {
    @Input() reply: any;
    @Input() user: any;
    @Input() wrapperClass = '';
    @Input() chatroom: any;
    chatroomData: any;
    replyDeletedText = '';

    constructor() {}

    ngOnInit(): void {
        if (this.reply?.answer) {
            this.reply.answer = this.reply?.answer
                .replace('* This is a gif message. Please update your app *', '')
                .replace(/(\r\n|\n|\r)/gm, '');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setDeletedStrings();
        if (changes.chatroom) {
            this.chatroomData = changes.chatroom.currentValue;
        }
    }

    setDeletedStrings(): void {
        this.replyDeletedText = this.checkDeletedMsg(this.reply?.member?.id, this.reply?.deleted_by);
    }

    checkDeletedMsg(memberId, deletedById): string {
        if (memberId && deletedById) {
            const userId = this.user?.id;
            if (memberId === userId) {
                if (deletedById === userId) {
                    return 'You deleted this message.';
                } else {
                    return 'Your message was deleted by a community manager.';
                }
            } else {
                if (memberId === deletedById) {
                    return 'This message was deleted.';
                } else {
                    return 'This message was deleted by a community manager.';
                }
            }
        } else {
            return '';
        }
    }
}
