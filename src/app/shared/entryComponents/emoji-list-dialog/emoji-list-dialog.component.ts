import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';

@Component({
    selector: 'app-emoji-list-dialog',
    templateUrl: './emoji-list-dialog.component.html',
    styleUrls: ['./emoji-list-dialog.component.scss'],
})
export class EmojiListDialogComponent implements OnInit {
    colors = [
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
    usersWithNoImage: any[] = [];
    messageReactions: any[];
    sortedMessageReactions: any[] = [];
    sortedReactionsList: any[] = [];
    selectedEmoji: any = 'All';
    moreEmojisValue = null;
    user: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private localStorageService: LocalStorageService) {}

    ngOnInit(): void {
        this.messageReactions = this.data?.reactionsList;
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.filterUsersWithNoImage();

        this.sortedMessageReactions = this.messageReactions;
        this.selectedEmoji = this.data?.reaction;
        this.sortReactions();
        this.sortMessageReactions();
    }

    sortReactions() {
        let sortedReactionsList: any[] = this.messageReactions.reduce((result: any[], reaction) => {
            const reactionIndex = result.findIndex((el) => el?.emoji === reaction?.reaction);

            if (reactionIndex >= 0) result[reactionIndex].value++;
            else result.push({ emoji: reaction?.reaction, value: 1 });

            return result;
        }, []);

        if (sortedReactionsList.length > 3) {
            sortedReactionsList = sortedReactionsList.slice(0, 3);
            this.moreEmojisValue =
                this.messageReactions.length -
                (sortedReactionsList[0]?.value + sortedReactionsList[1]?.value + sortedReactionsList[2]?.value);
        }
        this.sortedReactionsList = sortedReactionsList;
    }

    sortMessageReactions(event?) {
        if (event?.target?.localName === 'img') {
            this.selectedEmoji = 'More';
            const filterEmojis = [
                this.sortedReactionsList[0]?.emoji,
                this.sortedReactionsList[1]?.emoji,
                this.sortedReactionsList[2]?.emoji,
            ];
            this.sortedMessageReactions = this.messageReactions.filter((reaction) => !filterEmojis.includes(reaction?.reaction));
            return;
        }
        if (event) this.selectedEmoji = event?.target?.innerText?.split(' ')[0];

        if (!this.selectedEmoji) {
            this.sortedMessageReactions = this.messageReactions;
            return;
        }

        if (this.selectedEmoji === 'All') this.sortedMessageReactions = this.messageReactions;
        else {
            if (this.moreEmojisValue) {
                console.log(99, this.selectedEmoji);
                const filterEmojis = [
                    this.sortedReactionsList[0]?.emoji,
                    this.sortedReactionsList[1]?.emoji,
                    this.sortedReactionsList[2]?.emoji,
                ];
                if (filterEmojis.includes(this.selectedEmoji)) {
                    this.sortedMessageReactions = this.messageReactions.filter((reaction) => reaction?.reaction === this.selectedEmoji);
                } else {
                    console.log(99);
                    this.selectedEmoji = 'More';
                    this.sortedMessageReactions = this.messageReactions.filter((reaction) => !filterEmojis.includes(reaction?.reaction));
                }
            } else this.sortedMessageReactions = this.messageReactions.filter((reaction) => reaction?.reaction === this.selectedEmoji);
        }
    }

    filterUsersWithNoImage() {
        const memberIndex = this.messageReactions.findIndex((reaction) => !reaction?.member?.image_url);
        const memberCopy = this.messageReactions[memberIndex];
        this.messageReactions[memberIndex] = {
            ...memberCopy,
            bgColor: this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))],
            nameInitials: this.userInit(memberCopy?.member?.name),
        };
    }

    userInit(name) {
        let initials = '';
        let namesList = name?.split(' ');
        if (namesList) {
            for (let name of namesList) {
                if (name[0] !== ' ' && name[0]) {
                    initials += name[0]?.toUpperCase();
                    if (initials.length === 2) break;
                }
            }
        }

        return initials;
    }
}
