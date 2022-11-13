import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';

@Component({
    selector: 'app-home-feed-search-list',
    templateUrl: './home-feed-search-list.component.html',
    styleUrls: ['./home-feed-search-list.component.scss'],
})
export class HomeFeedSearchListComponent implements OnInit, OnChanges {
    @Input() isLoading: boolean = false;
    @Input() searchResultsChatrooms: any[] = [];
    @Input() searchResultsConversations: any[] = [];
    @Input() searchValue: string;
    @Output() closeSearchResults: EventEmitter<any> = new EventEmitter();
    searchString: string = '';
    user: any = null;

    constructor(private localStorageService: LocalStorageService, private router: Router) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.searchValue && changes.searchValue.currentValue) {
            this.searchString = changes.searchValue.currentValue;
        }
    }

    openChatroom(chatroomId: string | number, communityId: string | number, conversationId: string | number) {
        this.closeSearchResults.emit();
        this.router.navigate([`/${communityId}`, 'collabcard', chatroomId], {
            state: { conversationId: conversationId ? conversationId : null },
        });
    }
}
